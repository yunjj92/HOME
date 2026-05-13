import { z } from 'zod';

export const apiErrorSchema = z.object({
  message: z.string().optional(),
  code: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
