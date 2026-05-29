import { z } from 'zod';

export const bankUpdateRequestSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  toDelete: z.boolean().optional(),
});

export type BankUpdateRequest = z.infer<typeof bankUpdateRequestSchema>;
