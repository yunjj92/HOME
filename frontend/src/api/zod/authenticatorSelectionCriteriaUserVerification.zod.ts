import { z } from 'zod';
import { AuthenticatorSelectionCriteriaUserVerification as AuthenticatorSelectionCriteriaUserVerificationModel } from '../model/authenticatorSelectionCriteriaUserVerification';

export const authenticatorSelectionCriteriaUserVerificationSchema = z.nativeEnum(AuthenticatorSelectionCriteriaUserVerificationModel);
export type AuthenticatorSelectionCriteriaUserVerification = z.infer<typeof authenticatorSelectionCriteriaUserVerificationSchema>;
