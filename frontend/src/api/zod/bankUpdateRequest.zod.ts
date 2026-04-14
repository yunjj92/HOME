import { z } from 'zod';

export const bankUpdateRequestSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  requestedBy: z.string().nullish(),
  toDelete: z.boolean().nullish(),
});

export type BankUpdateRequest = z.infer<typeof bankUpdateRequestSchema>;
