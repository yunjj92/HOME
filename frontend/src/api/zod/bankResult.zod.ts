import { z } from 'zod';

export const bankResultSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
});

export type BankResult = z.infer<typeof bankResultSchema>;
