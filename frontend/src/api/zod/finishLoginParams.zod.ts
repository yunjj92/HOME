import { z } from 'zod';

export const finishLoginParamsSchema = z.any();
export type FinishLoginParams = z.infer<typeof finishLoginParamsSchema>;
