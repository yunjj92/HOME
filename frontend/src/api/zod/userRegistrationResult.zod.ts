import { z } from 'zod';
import { publicKeyCredentialCreationOptionsSchema } from './publicKeyCredentialCreationOptions.zod';

export const userRegistrationResultSchema = z.object({
  userName: z.string().optional(),
  creationOptions: publicKeyCredentialCreationOptionsSchema.optional(),
});

export type UserRegistrationResult = z.infer<typeof userRegistrationResultSchema>;
