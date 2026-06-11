import { z } from 'zod';

export const tagUpdateRequestSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  toDelete: z.boolean().optional(),
  clientKey: z.number().optional(),
});

export type TagUpdateRequest = z.infer<typeof tagUpdateRequestSchema>;
