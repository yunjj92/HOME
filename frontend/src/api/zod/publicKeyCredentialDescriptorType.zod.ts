import { z } from 'zod';
import { PublicKeyCredentialDescriptorType } from '../model/publicKeyCredentialDescriptorType';

export const publicKeyCredentialDescriptorTypeSchema = z.nativeEnum(PublicKeyCredentialDescriptorType);
export type PublicKeyCredentialDescriptorType = z.infer<typeof publicKeyCredentialDescriptorTypeSchema>;
