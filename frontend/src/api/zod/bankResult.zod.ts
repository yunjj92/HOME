import { z } from 'zod';

export const bankResultSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type BankResult = z.infer<typeof bankResultSchema>;
