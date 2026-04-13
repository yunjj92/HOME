import { z } from 'zod';
import { allowedCredentialResponseSchema } from './allowedCredentialResponse.zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const loginResponseSchema = z.object({
  username: z.string().nullish(),
  challenge: z.string().nullish(),
  timeout: z.string().nullish(),
  rpId: z.string().nullish(),
  allowCredentials: z.array(allowedCredentialResponseSchema).nullish(),
  userVerification: z.string().nullish(),
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
