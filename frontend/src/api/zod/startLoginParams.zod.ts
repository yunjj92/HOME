import { z } from 'zod';

export const startLoginParamsSchema = z.any();
export type StartLoginParams = z.infer<typeof startLoginParamsSchema>;
