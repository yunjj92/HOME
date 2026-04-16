import { z } from 'zod';

export const apiErrorSchema = z.object({
  message: z.string().nullish(),
  code: z.string().nullish(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
