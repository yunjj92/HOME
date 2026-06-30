import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const ministryResponseSchema = z.object({
  accountId: z.number().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const ministryDataSchema = ministryResponseSchema;

export const initMinistryResponseSchema =
  createApiResponseSchema(ministryDataSchema);

export type MinistryData = z.infer<
  typeof ministryDataSchema
>;

export type InitMinistryResponse = z.infer<
  typeof initMinistryResponseSchema
>;
