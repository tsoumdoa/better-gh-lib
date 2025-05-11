import { z } from "zod";
export const TypeNameCodeSchema = z.object({
  "@_name": z.string(),
  "@_type_name": z.string(),
  "@_type_code": z.number(),
});
