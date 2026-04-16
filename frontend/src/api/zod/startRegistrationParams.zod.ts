import { z } from 'zod';

export const startRegistrationParamsSchema = z.any();
export type StartRegistrationParams = z.infer<typeof startRegistrationParamsSchema>;
