import { z } from "zod";

const alertSchema = z.object({
  timestamp: z.string().datetime(), // ISO 8601 format
  severity_level: z.number().int().min(1).max(5),
  message: z.string(),
  effected_pids: z.array(z.number().int()),
});

export default alertSchema;
