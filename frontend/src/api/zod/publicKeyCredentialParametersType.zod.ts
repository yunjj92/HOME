import { z } from 'zod';
import { PublicKeyCredentialParametersType as PublicKeyCredentialParametersTypeModel } from '../model/publicKeyCredentialParametersType';

export const publicKeyCredentialParametersTypeSchema = z.nativeEnum(PublicKeyCredentialParametersTypeModel);
export type PublicKeyCredentialParametersType = z.infer<typeof publicKeyCredentialParametersTypeSchema>;
