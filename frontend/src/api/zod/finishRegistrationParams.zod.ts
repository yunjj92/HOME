import { z } from 'zod';

export const finishRegistrationParamsSchema = z.any();
export type FinishRegistrationParams = z.infer<typeof finishRegistrationParamsSchema>;
