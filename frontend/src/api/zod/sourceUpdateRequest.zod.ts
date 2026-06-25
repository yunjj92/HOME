import { z } from 'zod';

export const sourceUpdateRequestSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  toDelete: z.boolean().optional(),
  clientKey: z.number().optional(),
});

export type SourceUpdateRequest = z.infer<typeof sourceUpdateRequestSchema>;
