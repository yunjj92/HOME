import { z } from 'zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const allowedCredentialResponseSchema = z.object({
  type: z.string().optional(),
  id: z.string().optional(),
  transport: z.string().optional(),
});

export const allowedCredentialDataSchema = allowedCredentialResponseSchema;

export const initAllowedCredentialResponseSchema =
  createApiResponseSchema(allowedCredentialDataSchema);

export type AllowedCredentialData = z.infer<
  typeof allowedCredentialDataSchema
>;

export type InitAllowedCredentialResponse = z.infer<
  typeof initAllowedCredentialResponseSchema
>;
