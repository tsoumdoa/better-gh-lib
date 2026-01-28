import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";

const StringAttribute = TypeNameCodeSchema.extend({
	"#text": z.string(),
});

const NumberAttribute = TypeNameCodeSchema.extend({
	"#text": z.number(),
});

const BoundsAttribute = TypeNameCodeSchema.extend({
	X: z.number(),
	Y: z.number(),
	W: z.number(),
	H: z.number(),
	"@_name": z.literal("Bounds"),
});

export type BoundsAttributeType = z.infer<typeof BoundsAttribute>;

const PivotAttribute = TypeNameCodeSchema.extend({
	X: z.number(),
	Y: z.number(),
	"@_name": z.literal("Pivot"),
});

export type PivotAttributeType = z.infer<typeof PivotAttribute>;

const SelectedAttribute = TypeNameCodeSchema.extend({
	"#text": z.boolean(),
	"@_name": z.literal("Selected"),
});

export const AttributeContainer = z.object({
	items: z
		.object({
			item: z.array(
				z.union([
					StringAttribute,
					NumberAttribute,
					BoundsAttribute,
					PivotAttribute,
					SelectedAttribute,
				])
			),
			"@_count": z.number(),
		})
		.optional(),
	"@_name": z.literal("Attributes"),
});
export type AttributeContainerType = z.infer<typeof AttributeContainer>;

export const PanelPropertiesContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.array(z.any()),
		"@_count": z.number(),
	}),
	"@_name": z.literal("PanelProperties"),
});

export const ScriptContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.array(z.any()),
		"@_count": z.number(),
	}),
	chunks: z.object({
		//todo not type safe yet
		chunk: z.any(),
		//this could be literal 1
		"@_count": z.number(),
	}),
	"@_name": z.literal("Script"),
});

export type ScriptContainerType = z.infer<typeof ScriptContainer>;

export const PersistentDataContainer = z.object({
	// items: z.any(),
	// chunks: z.any(),
	items: z.object({
		//todo not type safe yet
		item: z.any(),
		"@_count": z.number(),
	}),
	chunks: z.object({
		//todo not type safe yet
		chunk: z.any(),
		//this could be literal 1
		"@_count": z.number(),
	}),
	"@_name": z.literal("PersistentData"),
});

export const ScriptEditorContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.any(),
		"@_count": z.number(),
	}),
	"@_name": z.literal("ScriptEditor"),
});

const ParamItem = TypeNameCodeSchema.extend({
	"#text": z.union([z.string(), z.number(), z.boolean()]),
	"@_name": z.union([
		z.literal("Access"),
		z.literal("Description"),
		z.literal("InstanceGuid"),
		z.literal("Name"),
		z.literal("NickName"),
		z.literal("Optional"),
		z.literal("Source"),
		z.literal("Hidden"), // visibility
		z.literal("Locked"), // disabled
		z.literal("SourceCount"),
	]),
});

export type ParamItemType = z.infer<typeof ParamItem>;

export const NodeParamContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.array(ParamItem).min(6),
		"@_count": z.number(),
	}),
	chunks: z.any(),
	"@_index": z.number(),
	"@_name": z.union([z.literal("param_input"), z.literal("param_output")]),
});

export type NodeParamContainerType = z.infer<typeof NodeParamContainer>;

const ParamChunk = z.object({
	//todo not type safe yet
	items: z.any(),
	//todo not type safe yet
	chunks: z.any(),
	"@_name": z.union([z.literal("InputParam"), z.literal("OutputParam")]),
	"@_index": z.number(),
});
export type ParamChunkType = z.infer<typeof ParamChunk>;

//cluster and userobject
export const ScriptParameterContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.any(),
		"@_count": z.number(),
	}),
	chunks: z
		.object({
			chunk: z.union([ParamChunk, z.array(ParamChunk)]),
			"@_count": z.number(),
		})
		.optional(),
	"@_name": z.literal("ParameterData"),
});
export type ScriptParameterContainerType = z.infer<
	typeof ScriptParameterContainer
>;

export const ListItemContainer = z.object({
	"@_index": z.number(),
	items: z.object({
		//todo not type safe yet
		item: z.any(),
		"@_count": z.number(),
	}),
	"@_name": z.literal("ListItem"),
});

// this happens only for hops
export const LexerContainer = z.object({
	items: z.object({
		//todo not type safe yet
		item: z.any(),
		"@_count": z.number(),
	}),
	"@_name": z.literal("lexers"),
});
