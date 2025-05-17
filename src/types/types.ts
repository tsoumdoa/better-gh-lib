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

const SchemaNames = [
  "DocumentHeader",
  "PreviewBoundary",
  "DefinitionProperties",
  "RcpLayout", //Remote Control Procedure Layout
  "GHALibraries",
  "ValueTable",
  "DefinitionObjects",
] as const;
export type SchemaNameLiteral = (typeof SchemaNames)[number];

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
        items: z.object({
          "@_count": z.literal(1),
          item: z.object({
            Major: z.number(),
            Minor: z.number(),
            Revision: z.number(),
            "@_name": z.literal("plugin_version"),
            "@_type_name": z.literal("gh_version"),
            "@_type_code": z.literal(80),
          }),
        }),
        chunks: z.object({
          "@_count": z.union([z.literal(5), z.literal(6), z.literal(7)]),
          chunk: z.array(
            //the ordering of type affects the order of validation
            z.union([
              DocumentHeaderSchema,
              PreviewBoundarySchema,
              DefinitionPropertiesSchema,
              RcpLayoutSchema,
              GhaLibrariesSchema,
              ValueTableSchema,
              DefinitionObjectsSchema,
            ])
          ),
        }),
      }),
    }),
    "@_name": z.string(),
  }),
});

export type ArchiveVersion = {
  major: number;
  minor: number;
  revision: number;
};

export type XmlMetrics = {
  archiveVersion: ArchiveVersion | undefined;
  componentCount: number | undefined;
  plugins: string[] | undefined;
  pluginsCount: number | undefined;
  totalNodes: number | undefined;
  maxDepth: number | undefined;
  schemaCoverage: number | undefined;
};
