import { z } from 'zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const allowedCredentialResponseSchema = z.object({
  type: z.string().nullish(),
  id: z.string().nullish(),
  transport: z.string().nullish(),
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
