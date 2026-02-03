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
import { ParamItemType, PivotAttributeType } from "./subs/param-object-schema";
import { ListBucketResultSchema, XmlSchema } from "./s3-bucket-list-schema";
import type { FunctionReturnType } from "convex/server";
import { Doc } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";

export type GhPost = Doc<"post">; // includes _id, _creationTime, fields
export type GhShares = Doc<"shares">; // includes _id, _creationTime, fields
export type GetSharedPost = FunctionReturnType<typeof api.ghCard.getSharedPost>;

export const GhCardSchema = z.object({
	name: z.string().min(3).max(30),
	description: z.string().max(150),
	tags: z.array(z.string()).max(20),
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

// export type XmlMetrics = {
//   archiveVersion: ArchiveVersion | undefined;
//   componentCount: number | undefined;
//   plugins: PluginLibraryType[] | undefined;
//   pluginsCount: number | undefined;
//   totalNodes: number | undefined;
//   uniqueComponentCount: number | undefined;
//   uniqueComponents:
//     | {
//         property: PropertyType;
//         count: number;
//       }[]
//     | undefined;
//   sizeOfScript: XY | undefined;
//   pluginInfo: PluginLibraryType[] | undefined;
//   scriptDensity: number | undefined;
// };

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
export type ExtractedCode = {
	htmlString: string;
	originalString: string;
	language: {
		language: string;
		version: string;
	};
	count: number;
	ioParams: ExtractedParamInfo;
};

export type ParamNameAndDescription = {
	name: string;
	description: string;
};

export type ExtractedParamInfo = {
	input: ParamNameAndDescription[];
	output: ParamNameAndDescription[];
};

//this is not good idea...duplicating typing with zod
export const SORT_ORDERS = [
	{ value: "ascAZ", label: "A-Z" },
	{ value: "descZA", label: "Z-A" },
	{ value: "descLastEdited", label: "Last Edited Date (Newest)" },
	{ value: "ascLastEdited", label: "Last Edited Date (Oldest)" },
	{ value: "descCreated", label: "Creation Date (Newest)" },
	{ value: "ascCreated", label: "Creation Date (Oldest)" },
] as const;

export const SortOrderZenum = z.enum([
	"ascAZ",
	"descZA",
	"ascLastEdited",
	"descLastEdited",
	"ascCreated",
	"descCreated",
]);
export type SortOrder = (typeof SORT_ORDERS)[number]["value"];
export type SortOrderValue = (typeof SORT_ORDERS)[number]["label"];
export type UserTag = {
	tag: string;
	count: number;
};
