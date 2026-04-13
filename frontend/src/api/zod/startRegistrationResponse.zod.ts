import { z } from 'zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const startRegistrationResponseSchema = z.object({
  username: z.string().nullish(),
  rpId: z.string().nullish(),
  challenge: z.string().nullish(),
  userId: z.string().nullish(),
  displayName: z.string().nullish(),
  pubKeyCredParams: z.string().nullish(),
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
