import { z } from 'zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const codeResponseSchema = z.object({
  id: z.number().nullish(),
  type_id: z.number().nullish(),
  code: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
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
