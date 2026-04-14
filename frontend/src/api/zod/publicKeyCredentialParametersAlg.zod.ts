import { z } from 'zod';
import { PublicKeyCredentialParametersAlg as PublicKeyCredentialParametersAlgModel } from '../model/publicKeyCredentialParametersAlg';

export const publicKeyCredentialParametersAlgSchema = z.nativeEnum(PublicKeyCredentialParametersAlgModel);
export type PublicKeyCredentialParametersAlg = z.infer<typeof publicKeyCredentialParametersAlgSchema>;
