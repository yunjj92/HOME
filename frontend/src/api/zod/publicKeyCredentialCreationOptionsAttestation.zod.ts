import { z } from 'zod';
import { PublicKeyCredentialCreationOptionsAttestation } from '../model/publicKeyCredentialCreationOptionsAttestation';

export const publicKeyCredentialCreationOptionsAttestationSchema = z.nativeEnum(PublicKeyCredentialCreationOptionsAttestation);
export type PublicKeyCredentialCreationOptionsAttestation = z.infer<typeof publicKeyCredentialCreationOptionsAttestationSchema>;
