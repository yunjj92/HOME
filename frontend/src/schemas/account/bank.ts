import { z } from "zod";

export const bankSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

export type Bank = z.infer<typeof bankSchema>;