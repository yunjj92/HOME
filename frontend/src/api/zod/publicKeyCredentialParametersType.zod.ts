import { z } from 'zod';
import { PublicKeyCredentialParametersType } from '../model/publicKeyCredentialParametersType';

export const publicKeyCredentialParametersTypeSchema = z.nativeEnum(PublicKeyCredentialParametersType);
export type PublicKeyCredentialParametersType = z.infer<typeof publicKeyCredentialParametersTypeSchema>;
