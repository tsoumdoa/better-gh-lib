import { z } from "zod";
export const AttributeChunk = z.object({
  // items: z.object({}).catchall(z.union([z.string(), z.number()])),
  items: z.object({}),
  // items: z.any(),
  "@_name": z.literal("Attributes"),
});

export const ParamInputChunk = z.object({
  items: z.object({}),
  chunks: z.object({}),
  "@_name": z.literal("param_input"),
  "@_index": z.number(),
});

export const ParamOutputChunk = z.object({
  items: z.object({}),
  chunks: z.object({}),
  "@_name": z.literal("param_output"),
  "@_index": z.number(),
});
