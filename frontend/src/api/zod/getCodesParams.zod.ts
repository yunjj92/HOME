import { z } from 'zod';

export const getCodesParamsSchema = z.any();
export type GetCodesParams = z.infer<typeof getCodesParamsSchema>;
