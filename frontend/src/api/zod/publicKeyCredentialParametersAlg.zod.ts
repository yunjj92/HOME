import { z } from 'zod';
import { PublicKeyCredentialParametersAlg } from '../model/publicKeyCredentialParametersAlg';

export const publicKeyCredentialParametersAlgSchema = z.nativeEnum(PublicKeyCredentialParametersAlg);
export type PublicKeyCredentialParametersAlg = z.infer<typeof publicKeyCredentialParametersAlgSchema>;
