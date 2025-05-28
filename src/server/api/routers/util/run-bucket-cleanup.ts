import { env } from "@/env";
import { DbType } from "@/server/db";
import { posts } from "@/server/db/schema";
import { S3BucketListSchema } from "@/types/types";
import { AwsClient } from "aws4fetch";
import { XMLParser } from "fast-xml-parser";
import { eq } from "drizzle-orm";
import { Redis } from "@upstash/redis";

async function listFiles(r2Client: AwsClient, userId: string) {
  const url = `${env.R2_URL}/?prefix=${userId}/`;
  const res = await r2Client.fetch(
    new Request(url, {
      method: "GET",
    })
  );
  if (!res.ok) {
    throw new Error(
      `Failed to list R2 objects for user "${userId}": ${res.status} ${res.statusText}`
    );
  }
  const resTextXml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: false,
    parseTagValue: true,
    parseAttributeValue: true,
    commentPropName: "comments",
    trimValues: true,
  });
  const parsedFromXml = parser.parse(resTextXml);

  const validatedXml = S3BucketListSchema.safeParse(parsedFromXml);

  if (!validatedXml.success) {
    return {
      isValid: false,
      errorMsg: JSON.stringify(validatedXml.error, null, 2),
      parsedJson: parsedFromXml,
    };
  }

  const body = validatedXml.data;
  const contents = body.ListBucketResult.Contents;
  // normalizing to array
  // fastxml praser return an object when there is only one item
  const contentKeys = contents
    ? (Array.isArray(contents) ? contents : [contents]).map(
        (content) => content.Key
      )
    : undefined;

  if (contentKeys === undefined) {
    return {
      isValid: false,
      errorMsg: "No contents",
      parsedJson: parsedFromXml,
    };
  }

  return {
    isValid: true,
    bucketKeys: contentKeys,
  };
}

async function deleteFiles(r2Client: AwsClient, keys: string[]) {
  //this thorows error if the request contains more than 1000 keys
  //think of chunking or sth in the future
  let xmlBody = '<?xml version="1.0" encoding="UTF-8"?>';
  xmlBody += '<Delete xmlns="http://s3.amazonaws.com/doc/2006-03-01/">';
  for (const key of keys) {
    xmlBody += "<Object>";
    xmlBody += `<Key>${key}</Key>`;
    xmlBody += "<VersionId></VersionId>";
    xmlBody += "</Object>";
  }
  xmlBody += "<Quiet>false</Quiet>";
  xmlBody += "</Delete>";

  const res = await r2Client.fetch(
    new Request(`${env.R2_URL}/?delete`, {
      method: "POST",
      body: xmlBody,
      headers: {
        "Content-Type": "application/xml",
      },
    })
  );
  console.log(res);
}
const setCleanupRun = async (redis: Redis, userId: string) => {
  await redis.set(`cleanupRun:${userId}`, "true", {
    ex: 60 * 60 * 24 * 7, // 1 week
  });
};

export default async function cleanUpBucket(
  r2Client: AwsClient,
  redis: Redis,
  db: DbType,
  userId: string
) {
  const hasRun = await redis.get(`cleanupRun:${userId}`);
  if (hasRun) {
    console.log("Already ran");
    return;
  }
  setCleanupRun(redis, userId);

  const [contentKeysResult, queryStatementResult] = await Promise.allSettled([
    listFiles(r2Client, userId),
    db.select().from(posts).where(eq(posts.clerkUserId, userId)),
  ]);

  if (
    contentKeysResult.status !== "fulfilled" ||
    queryStatementResult.status !== "fulfilled"
  ) {
    setCleanupRun(redis, userId);
    return;
  }

  const contentKeys = contentKeysResult.value;
  if (contentKeys.isValid === false || contentKeys.bucketKeys === undefined) {
    setCleanupRun(redis, userId);
    return;
  }

  const splitR2Keys = contentKeys.bucketKeys.map((key) => key.split("/")[1]);

  const queryStatement = queryStatementResult.value;
  const dbBucketKeysSet = new Set(
    queryStatement.map((item) => item.bucketUrl.replace(`${userId}/`, ""))
  );

  const diff = splitR2Keys.filter((key) => !dbBucketKeysSet.has(key));

  if (diff.length === 0) {
    return;
  }

  const bucketItemCount = contentKeys.bucketKeys.length;
  const dbRecordCount = queryStatement.length;

  const prefixKeys = diff.map((key) => `${userId}/${key}`);
  console.log(
    `Found ${bucketItemCount} bucket items in r2, but only ${dbRecordCount} in db. Deleting ${diff.length} from r2`
  );

  await deleteFiles(r2Client, prefixKeys);
}
