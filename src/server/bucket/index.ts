import { AwsClient } from "aws4fetch";
import { env } from "@/env";

export const r2Client = new AwsClient({
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  region: "auto",
});
