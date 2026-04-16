import { z } from 'zod';
import { PublicKeyCredentialDescriptorType as PublicKeyCredentialDescriptorTypeModel } from '../model/publicKeyCredentialDescriptorType';

export const publicKeyCredentialDescriptorTypeSchema = z.nativeEnum(PublicKeyCredentialDescriptorTypeModel);
export type PublicKeyCredentialDescriptorType = z.infer<typeof publicKeyCredentialDescriptorTypeSchema>;
