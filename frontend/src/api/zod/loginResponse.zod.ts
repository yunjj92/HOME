import { z } from 'zod';
import { allowedCredentialResponseSchema } from './allowedCredentialResponse.zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const loginResponseSchema = z.object({
  username: z.string().optional(),
  challenge: z.string().optional(),
  timeout: z.string().optional(),
  rpId: z.string().optional(),
  allowCredentials: z.array(allowedCredentialResponseSchema).optional(),
  userVerification: z.string().optional(),
});

export const loginDataSchema = loginResponseSchema;

export const initLoginResponseSchema =
  createApiResponseSchema(loginDataSchema);

export type LoginData = z.infer<
  typeof loginDataSchema
>;

export type InitLoginResponse = z.infer<
  typeof initLoginResponseSchema
>;
