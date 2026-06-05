import { z } from 'zod';

export const codeUpdateRequestSchema = z.object({
  id: z.number().optional(),
  typeId: z.number().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  toDelete: z.boolean().optional(),
});

export type CodeUpdateRequest = z.infer<typeof codeUpdateRequestSchema>;
