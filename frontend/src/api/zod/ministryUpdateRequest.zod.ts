import { z } from 'zod';

export const ministryUpdateRequestSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  requestedBy: z.string().optional(),
  toDelete: z.boolean().optional(),
});

export type MinistryUpdateRequest = z.infer<typeof ministryUpdateRequestSchema>;
