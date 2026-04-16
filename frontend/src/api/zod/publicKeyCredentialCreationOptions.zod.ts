import { z } from 'zod';
import { authenticatorSelectionCriteriaSchema } from './authenticatorSelectionCriteria.zod';
import { publicKeyCredentialCreationOptionsAttestationSchema } from './publicKeyCredentialCreationOptionsAttestation.zod';
import { publicKeyCredentialDescriptorSchema } from './publicKeyCredentialDescriptor.zod';
import { publicKeyCredentialParametersSchema } from './publicKeyCredentialParameters.zod';
import { registrationExtensionInputsSchema } from './registrationExtensionInputs.zod';
import { relyingPartyIdentitySchema } from './relyingPartyIdentity.zod';
import { userIdentitySchema } from './userIdentity.zod';

export const publicKeyCredentialCreationOptionsSchema = z.object({
  rp: relyingPartyIdentitySchema.nullish(),
  user: userIdentitySchema.nullish(),
  challenge: z.string().nullish(),
  pubKeyCredParams: z.array(publicKeyCredentialParametersSchema).nullish(),
  timeout: z.number().nullish(),
  excludeCredentials: z.array(publicKeyCredentialDescriptorSchema).nullish(),
  authenticatorSelection: authenticatorSelectionCriteriaSchema.nullish(),
  attestation: publicKeyCredentialCreationOptionsAttestationSchema.nullish(),
  extensions: registrationExtensionInputsSchema.nullish(),
});

export type PublicKeyCredentialCreationOptions = z.infer<typeof publicKeyCredentialCreationOptionsSchema>;
