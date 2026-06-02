import { z } from 'zod';

export const refreshParamsSchema = z.any();
export type RefreshParams = z.infer<typeof refreshParamsSchema>;
