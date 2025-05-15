import { z } from "zod";
import { LibrarySchema } from "./subs/library-type-schema";
import { TypeNameCodeSchema } from "./subs/typenamecode-schema";
import { DefinitionObjectsMainChunk } from "./subs/definition-objects-schema";

export const GenericItemsSchema = z.object({
  "@_count": z.number(),
  item: z.array(z.object({}).catchall(z.union([z.string(), z.number()]))),
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
  items: z.object({
    "@_count": z.literal(4),
    item: z.array(
      z.union([
        TypeNameCodeSchema.extend({
          "#text": z.union([z.string(), z.number()]),
          "@_name": z.literal("Date"),
        }),
        TypeNameCodeSchema.extend({
          "@_name": z.literal("Description"),
        }),
        TypeNameCodeSchema.extend({
          "#text": z.boolean(),
          "@_name": z.literal("KeepOpen"),
        }),
        TypeNameCodeSchema.extend({
          "@_name": z.literal("Name"),
          //this should be the name of the file
          "#text": z.string().optional(),
        }),
      ])
    ),
  }),
  chunks: z.object({
    "@_count": z.literal(3),
    chunk: z.array(
      z.union([
        z.object({
          "@_name": z.literal("Revisions"),
          items: z.object({
            "@_count": z.literal(1),
            item: TypeNameCodeSchema.extend({
              "@_name": z.literal("RevisionCount"),
              "#text": z.number(),
            }),
          }),
        }),
        z.object({
          "@_name": z.literal("Projection"),
          items: z.object({
            "@_count": z.literal(2),
            item: z.array(
              z.union([
                TypeNameCodeSchema.extend({
                  X: z.number(),
                  Y: z.number(),
                  "@_name": z.literal("Target"),
                }),
                TypeNameCodeSchema.extend({
                  "#text": z.number(),
                  "@_name": z.literal("Zoom"),
                }),
              ])
            ),
          }),
        }),
        z.object({
          "@_name": z.literal("Views"),
          items: z.object({
            "@_count": z.literal(1),
            item: TypeNameCodeSchema.extend({
              "@_name": z.literal("ViewCount"),
              "#text": z.number(),
            }),
          }),
        }),
      ])
    ),
  }),
});

export const RcpLayoutSchema = z.object({
  "@_name": z.literal("RcpLayout"),
  items: z.object({
    "@_count": z.number(),
    item: z.object({}).catchall(z.union([z.string(), z.number()])),
    //chunks exist only when remote control exists
    // unsupported for now
    chunks: z
      .object({})
      .catchall(z.union([z.string(), z.number()]))
      .optional(),
  }),
});

export const GhaLibrariesSchema = z.object({
  "@_name": z.literal("GHALibraries"),
  items: z.object({
    "@_count": z.number(),
    item: TypeNameCodeSchema.extend({
      "#text": z.number(),
      "@_name": z.literal("Count"),
    }),
  }),
  chunks: z.object({
    "@_count": z.number(),
    chunk: z.union([z.array(LibrarySchema), LibrarySchema]),
  }),
});

export const DefinitionObjectsSchema = z.object({
  "@_name": z.literal("DefinitionObjects"),
  items: z.object({
    "@_count": z.literal(1),
    item: TypeNameCodeSchema.extend({
      "#text": z.number(),
      "@_name": z.literal("ObjectCount"),
    }),
  }),
  chunks: z.object({
    "@_count": z.number(),
    chunk: z.union([
      z.array(DefinitionObjectsMainChunk),
      DefinitionObjectsMainChunk,
    ]),
  }),
});

// exists only when valueTable exists
// unsupported for now
export const ValueTableSchema = z.object({
  "@_name": z.literal("ValueTable"),
  items: z.object({}).catchall(z.any()),
});

// exists only when previewBoundary exists
// unsupported for now
export const PreviewBoundarySchema = z.object({
  "@_name": z.literal("PreviewBoundary"),
  items: z.object({}).catchall(z.any()),
});
