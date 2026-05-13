import { z } from 'zod';
import { authenticatorSelectionCriteriaAuthenticatorAttachmentSchema } from './authenticatorSelectionCriteriaAuthenticatorAttachment.zod';
import { authenticatorSelectionCriteriaResidentKeySchema } from './authenticatorSelectionCriteriaResidentKey.zod';
import { authenticatorSelectionCriteriaUserVerificationSchema } from './authenticatorSelectionCriteriaUserVerification.zod';

export const authenticatorSelectionCriteriaSchema = z.object({
  authenticatorAttachment: authenticatorSelectionCriteriaAuthenticatorAttachmentSchema.optional(),
  requireResidentKey: z.boolean().optional(),
  residentKey: authenticatorSelectionCriteriaResidentKeySchema.optional(),
  userVerification: authenticatorSelectionCriteriaUserVerificationSchema.optional(),
});

export type AuthenticatorSelectionCriteria = z.infer<typeof authenticatorSelectionCriteriaSchema>;
