import { z } from "zod";

export const accountSchema = z.object({
  id: z.number(),
  bankId: z.number(),
  bankName: z.string(),
  accountType: z.string(),
  name: z.string(),
  owner: z.string(),
  currencyType: z.string(),
  accountNumber: z.string(),
  description: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  updatedAt: z.string().nullable(),
  updatedBy: z.string().nullable(),
});

export type Account = z.infer<typeof accountSchema>;