import { z } from 'zod';
import { publicKeyCredentialParametersAlgSchema } from './publicKeyCredentialParametersAlg.zod';
import { publicKeyCredentialParametersTypeSchema } from './publicKeyCredentialParametersType.zod';

export const publicKeyCredentialParametersSchema = z.object({
  alg: publicKeyCredentialParametersAlgSchema.nullish(),
  type: publicKeyCredentialParametersTypeSchema.nullish(),
});

export type PublicKeyCredentialParameters = z.infer<typeof publicKeyCredentialParametersSchema>;
