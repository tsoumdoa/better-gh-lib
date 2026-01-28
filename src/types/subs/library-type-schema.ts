import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";

const VanilaLibrarySchema = z.object({
	"@_name": z.literal("Library"),
	"@_index": z.number(),
	items: z.object({
		item: z.array(
			z.union([
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Author"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Id"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Name"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Version"),
				}),
			])
		),
		"@_count": z.literal(4),
	}),
});

const PluginLibrarySchema = z.object({
	"@_name": z.literal("Library"),
	"@_index": z.number(),
	items: z.object({
		item: z.array(
			z.union([
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("AssemblyFullName"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("AssemblyVersion"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string().optional(),
					"@_name": z.literal("Author"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Id"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Name"),
				}),
				TypeNameCodeSchema.extend({
					"#text": z.string(),
					"@_name": z.literal("Version"),
				}),
			])
		),
		"@_count": z.literal(6),
	}),
});

export type VanilaLibrarySchemaType = z.infer<typeof VanilaLibrarySchema>;
export type PluginLibrarySchemaType = z.infer<typeof PluginLibrarySchema>;

export type VanilaLibraryType = {
	author: string | undefined;
	id: string;
	name: string;
	version: string;
};
export type PluginLibraryType = {
	assemblyFullName: string;
	assemblyVersion: string;
	author: string | undefined;
	id: string;
	name: string;
	version: string;
};

export const LibrarySchema = z.union([
	VanilaLibrarySchema,
	PluginLibrarySchema,
]);

export type LibrarySchemaType = z.infer<typeof LibrarySchema>;
