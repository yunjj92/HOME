import { z } from 'zod';

export const accountUpdateRequestSchema = z.object({
  id: z.number().optional(),
  bankId: z.number().optional(),
  accountType: z.string().optional(),
  name: z.string().optional(),
  owner: z.string().optional(),
  currencyType: z.string().optional(),
  accountNumber: z.string().optional(),
  description: z.string().optional(),
  requestedBy: z.string().optional(),
  toDelete: z.boolean().optional(),
});

export type AccountUpdateRequest = z.infer<typeof accountUpdateRequestSchema>;
