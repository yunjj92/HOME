import { z } from 'zod';

export const typeUpdateRequestSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  toDelete: z.boolean().optional(),
});

export type TypeUpdateRequest = z.infer<typeof typeUpdateRequestSchema>;
