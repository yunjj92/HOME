import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const startRegistrationResponseSchema = z.object({
  username: z.string().optional(),
  rpId: z.string().optional(),
  challenge: z.string().optional(),
  userId: z.string().optional(),
  displayName: z.string().optional(),
  pubKeyCredParams: z.string().optional(),
});

export const startRegistrationDataSchema = startRegistrationResponseSchema;

export const initStartRegistrationResponseSchema =
  createApiResponseSchema(startRegistrationDataSchema);

export type StartRegistrationData = z.infer<
  typeof startRegistrationDataSchema
>;

export type InitStartRegistrationResponse = z.infer<
  typeof initStartRegistrationResponseSchema
>;
