import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";
import {
  AttributeContainer,
  ScriptContainer,
  ScriptEditorContainer,
  PanelPropertiesContainer,
  ParameterContainer,
  ParamInputContainer,
  ParamOutputContainer,
  PersistentDataContainer,
  LexerContainer,
  ListItemContainer,
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

export type PropertyType = {
  guid: string;
  lib: string | undefined;
  name: string;
};

const ItemObjectNameLiteral = z.union([
  z.literal("Description"),
  z.literal("gh_guid"),
  z.literal("Name"),
  z.literal("InstanceGuid"),
  z.literal("NickName"),
  z.literal("Optional"),
  z.literal("Source"),
  z.literal("SourceCount"),
  z.literal("WireDisplay"),
  z.literal("UserText"),
  z.literal("ScrollRatio"),
  z.string(),
]);

const ItemObjectChunk = z.object({
  item: z.array(
    TypeNameCodeSchema.extend({
      "#text": z.union([z.string(), z.number(), z.boolean()]).optional(),
      "@_index": z.number().optional(),
      "@_name": ItemObjectNameLiteral,
      //check when this happen
      ARGB: z.string().optional(),
      //check when this happen
      Major: z.number().optional(),
      Minor: z.number().optional(),
      Revision: z.number().optional(),
      //happen only with itnernalized hops
      stream: z.any().optional(),
    })
  ),
  "@_count": z.number(),
});

export type ItemObjChunkType = z.infer<typeof ItemObjectChunk>;

const DefinitionObjectChunkChunk = z.union([
  AttributeContainer,
  PanelPropertiesContainer,
  ParameterContainer,
  ParamInputContainer,
  ParamOutputContainer,
  ScriptContainer,
  ScriptEditorContainer,
  PersistentDataContainer,
  ListItemContainer,
  //this type is only for hops, but it fails to paste back to GH
  LexerContainer,
  //use this for debugging, when above type is not exhaustive
  // z.object({}),
  z.any(),
]);

const DefinitionObjectChunk = z.object({
  chunk: z.union([
    DefinitionObjectChunkChunk,
    z.array(DefinitionObjectChunkChunk),
  ]),
  "@_count": z.number(),
});

export type DefObjChunk = z.infer<typeof DefinitionObjectChunk>;

const ContainerChunk = z.object({
  "@_name": z.literal("Container"),
  items: z.union([ItemObjectChunk, z.array(ItemObjectChunk)]),
  chunks: z.union([DefinitionObjectChunk, z.array(DefinitionObjectChunk)]),
});

export type ContainerChunk = z.infer<typeof ContainerChunk>;

export const DefinitionObjectsMainChunk = z.object({
  items: PropertyItemObject,
  chunks: z.object({
    chunk: z.union([ContainerChunk, z.array(ContainerChunk)]),
    "@_count": z.number(),
  }),
  "@_name": z.literal("Object"),
  "@_index": z.number(),
});

export type DefObjMainChunkType = z.infer<typeof DefinitionObjectsMainChunk>;
