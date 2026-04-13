import { z } from 'zod';
import { AuthenticatorSelectionCriteriaAuthenticatorAttachment } from '../model/authenticatorSelectionCriteriaAuthenticatorAttachment';

export const authenticatorSelectionCriteriaAuthenticatorAttachmentSchema = z.nativeEnum(AuthenticatorSelectionCriteriaAuthenticatorAttachment);
export type AuthenticatorSelectionCriteriaAuthenticatorAttachment = z.infer<typeof authenticatorSelectionCriteriaAuthenticatorAttachmentSchema>;
