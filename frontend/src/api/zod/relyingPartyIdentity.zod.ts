import { z } from 'zod';

export const relyingPartyIdentitySchema = z.object({
  name: z.string().optional(),
  id: z.string().optional(),
});

export type RelyingPartyIdentity = z.infer<typeof relyingPartyIdentitySchema>;
