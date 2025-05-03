import { z } from "zod";

export const GhCardSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(150),
});

export const GhXmlGhCardSchema = GhCardSchema.extend({
  xml: z.string(),
});

export type GhCard = z.infer<typeof GhCardSchema>;
