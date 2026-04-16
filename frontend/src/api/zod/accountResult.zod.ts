import { z } from 'zod';

export const accountResultSchema = z.object({
  id: z.number().nullish(),
  bankId: z.number().nullish(),
  bankName: z.string().nullish(),
  accountType: z.string().nullish(),
  name: z.string().nullish(),
  owner: z.string().nullish(),
  currencyType: z.string().nullish(),
  accountNumber: z.string().nullish(),
  description: z.string().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
});

export type AccountResult = z.infer<typeof accountResultSchema>;
