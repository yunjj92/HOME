import { z } from 'zod';
import { publicKeyCredentialDescriptorTypeSchema } from './publicKeyCredentialDescriptorType.zod';

export const publicKeyCredentialDescriptorSchema = z.object({
  type: publicKeyCredentialDescriptorTypeSchema.optional(),
  id: z.string().optional(),
  transports: z.array(z.string()).optional(),
});

export type PublicKeyCredentialDescriptor = z.infer<typeof publicKeyCredentialDescriptorSchema>;
