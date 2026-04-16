import { z } from 'zod';
import { publicKeyCredentialDescriptorTypeSchema } from './publicKeyCredentialDescriptorType.zod';

export const publicKeyCredentialDescriptorSchema = z.object({
  type: publicKeyCredentialDescriptorTypeSchema.nullish(),
  id: z.string().nullish(),
  transports: z.array(z.string()).nullish(),
});

export type PublicKeyCredentialDescriptor = z.infer<typeof publicKeyCredentialDescriptorSchema>;
