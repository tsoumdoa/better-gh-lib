import { z } from "zod";
export const GenericItemsSchema = z.object({
  "@_count": z.number(),
  item: z.array(z.object({}).catchall(z.union([z.string(), z.number()]))),
});

const TypeNameCodeSchema = z.object({
  "@_name": z.string(),
  "@_type_name": z.string(),
  "@_type_code": z.number(),
});

export const VersionSchema = TypeNameCodeSchema.extend({
  Major: z.number(),
  Minor: z.number(),
  Revision: z.number(),
});

export const DocumentHeaderSchema = z.object({
  "@_name": z.literal("DocumentHeader"),
  items: z.object({
    "@_count": z.union([z.literal(5), z.literal(6)]),
    item: z.array(
      z.union([
        TypeNameCodeSchema.extend({
          "#text": z.string(),
          "@_name": z.union([
            z.literal("DocumentID"),
            z.literal("Preview"),
            z.literal("PreviewFilter"),
          ]),
        }),
        TypeNameCodeSchema.extend({
          "#text": z.number(),
          "@_name": z.literal("PreviewMeshType"),
        }),
        TypeNameCodeSchema.extend({
          ARGB: z.string(),
          "@_name": z.union([
            z.literal("PreviewNormal"),
            z.literal("PreviewSelected"),
          ]),
        }),
      ])
    ),
  }),
});

export const DefinitionPropertiesSchema = z.object({
  "@_name": z.literal("DefinitionProperties"),
  chunks: z.object({}),
  items: z.object({}),
});

export const RcpLayoutSchema = z.object({
  "@_name": z.literal("RcpLayout"),
  items: z.object({}),
});

export const GhaLibrariesSchema = z.object({
  "@_name": z.literal("GHALibraries"),
  chunks: z.object({}),
  items: z.object({}),
});

export const DefinitionObjectsSchema = z.object({
  "@_name": z.literal("DefinitionObjects"),
  chunks: z.object({}),
  items: z.object({}),
});

export const ValueTableSchema = z.object({
  "@_name": z.literal("ValueTable"),
  items: z.object({}),
});

export const PreviewBoundarySchema = z.object({
  "@_name": z.literal("PreviewBoundary"),
  items: z.object({}),
});
