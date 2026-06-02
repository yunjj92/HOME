import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const tokenResponseSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const tokenDataSchema = tokenResponseSchema;

export const initTokenResponseSchema =
  createApiResponseSchema(tokenDataSchema);

export type TokenData = z.infer<
  typeof tokenDataSchema
>;

export type InitTokenResponse = z.infer<
  typeof initTokenResponseSchema
>;
