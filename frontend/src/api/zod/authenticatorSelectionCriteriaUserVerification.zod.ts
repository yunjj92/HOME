import { z } from 'zod';
import { AuthenticatorSelectionCriteriaUserVerification } from '../model/authenticatorSelectionCriteriaUserVerification';

export const authenticatorSelectionCriteriaUserVerificationSchema = z.nativeEnum(AuthenticatorSelectionCriteriaUserVerification);
export type AuthenticatorSelectionCriteriaUserVerification = z.infer<typeof authenticatorSelectionCriteriaUserVerificationSchema>;
