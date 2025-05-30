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
import { PluginLibraryType } from "./subs/library-type-schema";
import { ParamItemType, PivotAttributeType } from "./subs/param-object-schema";
import { PropertyType } from "./subs/definition-objects-schema";
import { ListBucketResultSchema, XmlSchema } from "./s3-bucket-list-schema";

export const GhCardSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(150),
});
export const GhXmlGhCardSchema = GhCardSchema.extend({
  xml: z.string(),
});
export type GhCard = z.infer<typeof GhCardSchema>;
export type GhXmlType = z.infer<typeof GhXml>;

export const SchemaNames = [
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
  plugins: PluginLibraryType[] | undefined;
  pluginsCount: number | undefined;
  totalNodes: number | undefined;
  uniqueComponentCount: number | undefined;
  uniqueComponents:
    | {
        property: PropertyType;
        count: number;
      }[]
    | undefined;
  sizeOfScript: XY | undefined;
  pluginInfo: PluginLibraryType[] | undefined;
  scriptDensity: number | undefined;
};

export type NodeParamReturnType = {
  pivotAtt: PivotAttributeType[][];
  nodeProperties: ParamItemType[][][];
  totalSourceCount: number;
  sources: void[][];
};

export type ScriptDataType = {
  language: string;
  version: string;
  script: string;
};

export type ScriptDataObj = {
  scriptData: (ScriptDataType | undefined)[];
};

export type XY = { x: number; y: number };

export const S3BucketListSchema = z.object({
  "?xml": XmlSchema.optional(), // The `?xml` key might not always be present
  ListBucketResult: ListBucketResultSchema,
});

export type S3BucketListType = z.infer<typeof S3BucketListSchema>;

const ShareLinkUidRegex = /^[a-z0-9]{10}$/;
export const ShareLinkUidSchema = z.string().regex(ShareLinkUidRegex, {
  message: "Invalid Nano ID format. Must be 10 characters using 0-9 and a-z.",
});

export type ShareLinkUid = z.infer<typeof ShareLinkUidSchema>;
