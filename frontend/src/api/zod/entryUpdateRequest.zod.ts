import { z } from 'zod';

export const entryUpdateRequestSchema = z.object({
  id: z.number().optional(),
  accountId: z.number(),
  date: z.string(),
  amount: z.number(),
  memo: z.string().optional(),
  connection: z.string(),
  ministryId: z.number().optional(),
  tagName: z.string().optional(),
  entryType: z.string(),
  toDelete: z.boolean().optional(),
});

export type EntryUpdateRequest = z.infer<typeof entryUpdateRequestSchema>;
