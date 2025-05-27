import { env } from "@/env";
import { DbType } from "@/server/db";
import { posts } from "@/server/db/schema";
import { S3BucketListSchema } from "@/types/types";
import { AwsClient } from "aws4fetch";
import { XMLParser } from "fast-xml-parser";
import { inArray, and, eq } from "drizzle-orm";

async function listFiles(r2Client: AwsClient, userId: string) {
  const url = `${env.R2_URL}/?prefix=${userId}/`;
  const res = await r2Client.fetch(
    new Request(url, {
      method: "GET",
    })
  );
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
  body.ListBucketResult.Contents?.map((content) => console.log(content));
  const contentKeys =
    body.ListBucketResult.Contents?.map((content) => content.Key) ?? undefined;

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
  let xmlBody = '<?xml version="1.0" encoding="UTF-8"?>';
  xmlBody += '<Delete xmlns="http://s3.amazonaws.com/doc/2006-03-01/">';
  for (const key of keys) {
    xmlBody += "<Object>";
    xmlBody += `<Key>${key}</Key>`;
    xmlBody += "</Object>";
  }
  xmlBody += "<Quiet>False</Quiet>";
  xmlBody += "</Delete>";

  console.log(xmlBody);
  const res = await r2Client.fetch(
    new Request(`${env.R2_URL}/?delete`, {
      method: "DELETE",
      body: xmlBody,
      headers: {
        "Content-Type": "application/xml",
      },
    })
  );
  console.log(res);
}

export default async function cleanUpBucket(
  r2Client: AwsClient,
  db: DbType,
  userId: string
) {
  const contentKeys = await listFiles(r2Client, userId);
  if (contentKeys.isValid === false || contentKeys.bucketKeys === undefined) {
    //add to retry
    return;
  }

  const splitR2Keys = contentKeys.bucketKeys.map((key) => key.split("/")[1]);

  const queryStatement = await db
    .select()
    .from(posts)
    .where(
      and(eq(posts.clerkUserId, userId), inArray(posts.bucketUrl, splitR2Keys))
    );

  const dbBucketKeys = queryStatement.map((item) => item.bucketUrl);

  const diff = splitR2Keys.filter((key) => !dbBucketKeys.includes(key));

  const bucketItemCount = contentKeys.bucketKeys.length;
  const dbRecordCount = queryStatement.length;

  const prefixKeys = diff.map((key) => `${userId}/${key}`);
  await deleteFiles(r2Client, prefixKeys);

  console.log(
    `Found ${bucketItemCount} bucket items in r2, but only ${dbRecordCount} in db. Deleted ${diff.length} from r2`
  );
}
