import { z } from 'zod';
import { AuthenticatorSelectionCriteriaResidentKey } from '../model/authenticatorSelectionCriteriaResidentKey';

export const authenticatorSelectionCriteriaResidentKeySchema = z.nativeEnum(AuthenticatorSelectionCriteriaResidentKey);
export type AuthenticatorSelectionCriteriaResidentKey = z.infer<typeof authenticatorSelectionCriteriaResidentKeySchema>;
