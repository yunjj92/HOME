import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const sourceResponseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const sourceDataSchema = sourceResponseSchema;

export const initSourceResponseSchema =
  createApiResponseSchema(sourceDataSchema);

export type SourceData = z.infer<
  typeof sourceDataSchema
>;

export type InitSourceResponse = z.infer<
  typeof initSourceResponseSchema
>;
