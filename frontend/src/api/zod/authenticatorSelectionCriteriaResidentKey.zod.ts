import { z } from 'zod';
import { AuthenticatorSelectionCriteriaResidentKey as AuthenticatorSelectionCriteriaResidentKeyModel } from '../model/authenticatorSelectionCriteriaResidentKey';

export const authenticatorSelectionCriteriaResidentKeySchema = z.nativeEnum(AuthenticatorSelectionCriteriaResidentKeyModel);
export type AuthenticatorSelectionCriteriaResidentKey = z.infer<typeof authenticatorSelectionCriteriaResidentKeySchema>;
