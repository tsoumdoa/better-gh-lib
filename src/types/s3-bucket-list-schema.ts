import { z } from "zod";

export const XmlSchema = z.object({
  "@_version": z.union([z.string(), z.number()]),
  "@_encoding": z.string(),
});

const ContentsSchema = z.object({
  Key: z.string(),
  LastModified: z.string(), // This could be `z.preprocess(str => new Date(str), z.date())` if you want a Date object
  ETag: z.string(),
  Size: z.union([z.string(), z.number()]), // Size can sometimes be a string in XML
  StorageClass: z.string(),
  Owner: z.object({
    ID: z.string(),
    DisplayName: z.string(),
  }),
});

export const ListBucketResultSchema = z.object({
  Name: z.string(),
  Contents: z.array(ContentsSchema).optional(), // Contents might be absent if the bucket is empty
  IsTruncated: z.boolean(),
  Prefix: z.string(),
  Marker: z.string(),
  MaxKeys: z.union([z.string(), z.number()]), // MaxKeys can sometimes be a string in XML
  "@_xmlns": z.string(),
});
