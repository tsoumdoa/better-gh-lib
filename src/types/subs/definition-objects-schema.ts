import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";
import {
  AttributeChunk,
  PanelPropertiesChunk,
  ParameterData,
  ParamInputChunk,
  ParamOutputChunk,
} from "./param-object-schema";

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

const ItemObjectChunk = z.object({
  item: z.array(
    TypeNameCodeSchema.extend({
      "#text": z.union([z.string(), z.number(), z.boolean()]).optional(),
    })
  ),
  "@_count": z.number(),
});

const DefinitionObjectChunkChunk = z.union([
  AttributeChunk,
  PanelPropertiesChunk,
  ParameterData,
  ParamInputChunk,
  ParamOutputChunk,
  //todo should be able to remove this
  z.any(),
]);

const DefinitionObjectChunk = z.object({
  chunk: z.union([
    DefinitionObjectChunkChunk,
    z.array(DefinitionObjectChunkChunk),
  ]),
  "@_count": z.number(),
});

const ChunkObject = z.object({
  items: z.union([ItemObjectChunk, z.array(ItemObjectChunk)]),
  chunks: z.union([DefinitionObjectChunk, z.array(DefinitionObjectChunk)]),
  "@_name": z.literal("Container"),
});

export const DefinitionObjectsMainChunk = z.object({
  items: PropertyItemObject,
  chunks: z.object({
    chunk: z.union([ChunkObject, z.array(ChunkObject)]),
    "@_count": z.number(),
  }),
  "@_name": z.string(),
  "@_index": z.number(),
});
