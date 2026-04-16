import { z } from 'zod';
import { authenticatorSelectionCriteriaAuthenticatorAttachmentSchema } from './authenticatorSelectionCriteriaAuthenticatorAttachment.zod';
import { authenticatorSelectionCriteriaResidentKeySchema } from './authenticatorSelectionCriteriaResidentKey.zod';
import { authenticatorSelectionCriteriaUserVerificationSchema } from './authenticatorSelectionCriteriaUserVerification.zod';

export const authenticatorSelectionCriteriaSchema = z.object({
  authenticatorAttachment: authenticatorSelectionCriteriaAuthenticatorAttachmentSchema.nullish(),
  requireResidentKey: z.boolean().nullish(),
  residentKey: authenticatorSelectionCriteriaResidentKeySchema.nullish(),
  userVerification: authenticatorSelectionCriteriaUserVerificationSchema.nullish(),
});

export type AuthenticatorSelectionCriteria = z.infer<typeof authenticatorSelectionCriteriaSchema>;
