import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";

const TwoPropertyObject = z.object({
  item: z.array(
    z.union([
      TypeNameCodeSchema.extend({
        "#text": z.string().uuid(),
        "@_name": z.literal("GUID"),
      }),
      TypeNameCodeSchema.extend({
        "#text": z.string(),
        "@_name": z.literal("Name"),
      }),
    ])
  ),
  "@_count": z.literal(2),
});

const ThreePropertyObject = z.object({
  item: z.array(
    z.union([
      TypeNameCodeSchema.extend({
        "#text": z.string().uuid(),
        "@_name": z.literal("GUID"),
      }),
      TypeNameCodeSchema.extend({
        "#text": z.string().uuid(),
        "@_name": z.literal("Lib"),
      }),
      TypeNameCodeSchema.extend({
        "#text": z.string(),
        "@_name": z.literal("Name"),
      }),
    ])
  ),
  "@_count": z.literal(3),
});

const PropertyItemObject = z.union([TwoPropertyObject, ThreePropertyObject]);

//todo
const ChunkObject = z.object({
  // items: z.object({}),
  items: z.union([z.object({}), z.array(z.object({}))]),
  chunks: z.object({}),
  "@_name": z.string(),
  "@_index": z.number(),
});

export const DefinitionObjectMainChunk = z.object({
  items: PropertyItemObject,
  chunks: z.object({
    // chunk: z.union([ChunkObject, z.array(ChunkObject)]),
    chunk: z.union([z.object({}), z.array(z.object({}))]),
    "@_count": z.number(),
  }),
  "@_name": z.string(),
  "@_index": z.number(),
});
