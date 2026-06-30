import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const codeResponseSchema = z.object({
  id: z.number().optional(),
  typeId: z.number().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const codeDataSchema = codeResponseSchema;

export const initCodeResponseSchema =
  createApiResponseSchema(codeDataSchema);

export type CodeData = z.infer<
  typeof codeDataSchema
>;

export type InitCodeResponse = z.infer<
  typeof initCodeResponseSchema
>;
