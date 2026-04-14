import { z } from 'zod';
import { PublicKeyCredentialCreationOptionsAttestation as PublicKeyCredentialCreationOptionsAttestationModel } from '../model/publicKeyCredentialCreationOptionsAttestation';

export const publicKeyCredentialCreationOptionsAttestationSchema = z.nativeEnum(PublicKeyCredentialCreationOptionsAttestationModel);
export type PublicKeyCredentialCreationOptionsAttestation = z.infer<typeof publicKeyCredentialCreationOptionsAttestationSchema>;
