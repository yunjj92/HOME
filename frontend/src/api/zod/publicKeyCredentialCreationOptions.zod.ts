import { z } from 'zod';
import { authenticatorSelectionCriteriaSchema } from './authenticatorSelectionCriteria.zod';
import { publicKeyCredentialCreationOptionsAttestationSchema } from './publicKeyCredentialCreationOptionsAttestation.zod';
import { publicKeyCredentialDescriptorSchema } from './publicKeyCredentialDescriptor.zod';
import { publicKeyCredentialParametersSchema } from './publicKeyCredentialParameters.zod';
import { registrationExtensionInputsSchema } from './registrationExtensionInputs.zod';
import { relyingPartyIdentitySchema } from './relyingPartyIdentity.zod';
import { userIdentitySchema } from './userIdentity.zod';

export const publicKeyCredentialCreationOptionsSchema = z.object({
  rp: relyingPartyIdentitySchema.optional(),
  user: userIdentitySchema.optional(),
  challenge: z.string().optional(),
  pubKeyCredParams: z.array(publicKeyCredentialParametersSchema).optional(),
  timeout: z.number().optional(),
  excludeCredentials: z.array(publicKeyCredentialDescriptorSchema).optional(),
  authenticatorSelection: authenticatorSelectionCriteriaSchema.optional(),
  attestation: publicKeyCredentialCreationOptionsAttestationSchema.optional(),
  extensions: registrationExtensionInputsSchema.optional(),
});

export type PublicKeyCredentialCreationOptions = z.infer<typeof publicKeyCredentialCreationOptionsSchema>;
