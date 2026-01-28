import { posts } from "@/server/db/schema";
import { desc, asc } from "drizzle-orm";
import { SortOrder } from "@/types/types";
import { env } from "@/env";

export const presignedUrl = (userId: string, nanoid: string, sec: number) =>
  `${env.R2_URL}/${userId}/${nanoid}?X-Amz-Expires=${sec}`;

export const deleteUrl = (userId: string, bucketKey: string) =>
  `${env.R2_URL}/${userId}/${bucketKey}`;

export const putUrl = (userId: string, bucketKey: string) =>
  `${env.R2_URL}/${userId}/${bucketKey}`;

export const orderBy = (key: SortOrder) => {
  switch (key) {
    case "ascAZ":
      return [asc(posts.name)]; // No colon after case

    case "descZA":
      return [desc(posts.name)];

    case "ascLastEdited":
      return [desc(posts.dateUpdated)];

    case "descLastEdited":
      return [asc(posts.dateUpdated)];

    case "ascCreated":
      return [desc(posts.dateCreated)];

    case "descCreated":
      return [asc(posts.dateCreated)];

    default:
      return [desc(posts.dateUpdated)];
  }
};
