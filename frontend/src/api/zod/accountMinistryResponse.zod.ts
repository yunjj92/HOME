import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const accountMinistryResponseSchema = z.object({
  accountId: z.number().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const accountMinistryDataSchema = accountMinistryResponseSchema;

export const initAccountMinistryResponseSchema =
  createApiResponseSchema(accountMinistryDataSchema);

export type AccountMinistryData = z.infer<
  typeof accountMinistryDataSchema
>;

export type InitAccountMinistryResponse = z.infer<
  typeof initAccountMinistryResponseSchema
>;
