import { z } from 'zod';

export const logoutParamsSchema = z.any();
export type LogoutParams = z.infer<typeof logoutParamsSchema>;
