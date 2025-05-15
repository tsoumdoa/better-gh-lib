import { z } from "zod";
import { TypeNameCodeSchema } from "./typenamecode-schema";

const StringAttribute = TypeNameCodeSchema.extend({
  "#text": z.string(),
});

const NumberAttribute = TypeNameCodeSchema.extend({
  "#text": z.number(),
});

const BundsAttribute = TypeNameCodeSchema.extend({
  X: z.number(),
  Y: z.number(),
  W: z.number(),
  H: z.number(),
  "@_name": z.literal("Bounds"),
});

const PivotAttribute = TypeNameCodeSchema.extend({
  X: z.number(),
  Y: z.number(),
  "@_name": z.literal("Pivot"),
});

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
          BundsAttribute,
          PivotAttribute,
          SelectedAttribute,
        ])
      ),
      "@_count": z.number(),
    })
    .optional(),
  "@_name": z.literal("Attributes"),
});

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

export const ParamInputContainer = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()).optional(),
    "@_count": z.number(),
  }),
  chunks: z.any(),
  "@_index": z.number(),
  "@_name": z.literal("param_input"),
});

export const ParamOutputContainer = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()),
    "@_count": z.number(),
  }),
  chunks: z.any(),
  "@_index": z.number(),
  "@_name": z.literal("param_output"),
});

const InputParamChunk = z.object({
  //todo not type safe yet
  items: z.any(),
  //todo not type safe yet
  chunks: z.any(),
  "@_name": z.literal("InputParam"),
  "@_index": z.number(),
});

const OutputParamChunk = z.object({
  //todo not type safe yet
  items: z.any(),
  //todo not type safe yet
  chunks: z.any(),
  "@_name": z.literal("OutputParam"),
  "@_index": z.number(),
});

export const ParameterContainer = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.any(),
    "@_count": z.number(),
  }),
  chunks: z
    .object({
      chunk: z.union([
        InputParamChunk,
        OutputParamChunk,
        z.array(z.union([InputParamChunk, OutputParamChunk])),
      ]),
      "@_count": z.number(),
    })
    .optional(),
  "@_name": z.literal("ParameterData"),
});

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
