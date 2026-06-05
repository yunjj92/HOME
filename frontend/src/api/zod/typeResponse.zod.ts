import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const typeResponseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const typeDataSchema = typeResponseSchema;

export const initTypeResponseSchema =
  createApiResponseSchema(typeDataSchema);

export type TypeData = z.infer<
  typeof typeDataSchema
>;

export type InitTypeResponse = z.infer<
  typeof initTypeResponseSchema
>;
