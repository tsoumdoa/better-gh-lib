import { z } from "zod";
export const AttributeChunk = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()),
    "@_count": z.number(),
  }),
  "@_name": z.literal("Attributes"),
});

export const PanelPropertiesChunk = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()),
    "@_count": z.number(),
  }),
  "@_name": z.literal("PanelProperties"),
});

export const ParamInputChunk = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()),
    "@_count": z.number(),
  }),
  chunks: z.any(),
  "@_name": z.literal("param_input"),
});

export const ParamOutputChunk = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.array(z.any()),
    "@_count": z.number(),
  }),
  chunks: z.any(),
  "@_name": z.literal("param_output"),
});

const InputParamChunk = z.object({
  // items: z.object({}),
  // chunks: z.object({}),
  //todo not type safe yet
  items: z.any(),
  //todo not type safe yet
  chunks: z.any(),
  "@_name": z.literal("InputParam"),
  "@_index": z.number(),
});

const OutputParamChunk = z.object({
  // items: z.object({}),
  // chunks: z.object({}),
  //todo not type safe yet
  items: z.any(),
  //todo not type safe yet
  chunks: z.any(),
  "@_name": z.literal("OutputParam"),
  "@_index": z.number(),
});

export const ParameterData = z.object({
  items: z.object({
    //todo not type safe yet
    item: z.any(),
    "@_count": z.number(),
  }),
  chunks: z.object({
    chunk: z.array(z.union([InputParamChunk, OutputParamChunk])),
    "@_count": z.number(),
  }),
  "@_name": z.literal("ParameterData"),
});
