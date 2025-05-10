import { z } from "zod";
import {
  DefinitionObjectsSchema,
  DefinitionPropertiesSchema,
  DocumentHeaderSchema,
  GhaLibrariesSchema,
  PreviewBoundarySchema,
  RcpLayoutSchema,
  ValueTableSchema,
  VersionSchema,
} from "./gh-xml-schema";

export const GhCardSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(150),
});

export const GhXmlGhCardSchema = GhCardSchema.extend({
  xml: z.string(),
});

export type GhCard = z.infer<typeof GhCardSchema>;

export type GhXmlType = z.infer<typeof GhXml>;
export const GhXml = z.object({
  Archive: z.object({
    comments: z
      .array(z.union([z.literal("Grasshopper archive"), z.string()]))
      .length(3),

    items: z.object({
      "@_count": z.literal(1),
      item: VersionSchema,
    }),
    chunks: z.object({
      "@_count": z.literal(1),
      chunk: z.object({
        "@_name": z.literal("Clipboard"),
        chunks: z.object({
          "@_count": z.union([z.literal(5), z.literal(6), z.literal(7)]),
          chunk: z.array(
            z.union([
              DocumentHeaderSchema,
              DefinitionPropertiesSchema,
              RcpLayoutSchema,
              GhaLibrariesSchema,
              DefinitionObjectsSchema,
              ValueTableSchema,
              PreviewBoundarySchema,
            ])
          ),
        }),
      }),
    }),
    "@_name": z.string(),
  }),
});
