import { z } from 'zod';

export const entryUpdateRequestSchema = z.object({
  id: z.number().optional(),
  accountId: z.number(),
  date: z.string(),
  amount: z.number(),
  memo: z.string().optional(),
  sourceId: z.number().optional(),
  merchant: z.string().optional(),
  ministryId: z.number().optional(),
  tagId: z.number().optional(),
  entryType: z.string(),
  toDelete: z.boolean().optional(),
});

export type EntryUpdateRequest = z.infer<typeof entryUpdateRequestSchema>;
