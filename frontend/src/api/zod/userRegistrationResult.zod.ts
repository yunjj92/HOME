import { z } from 'zod';
import { publicKeyCredentialCreationOptionsSchema } from './publicKeyCredentialCreationOptions.zod';

export const userRegistrationResultSchema = z.object({
  userName: z.string().nullish(),
  creationOptions: publicKeyCredentialCreationOptionsSchema.nullish(),
});

export type UserRegistrationResult = z.infer<typeof userRegistrationResultSchema>;
