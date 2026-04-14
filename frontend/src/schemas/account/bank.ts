import { z } from "zod";

export const bankSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
});

export type Bank = z.infer<typeof bankSchema>;