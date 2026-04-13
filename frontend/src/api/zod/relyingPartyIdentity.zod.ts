import { z } from 'zod';

export const relyingPartyIdentitySchema = z.object({
  name: z.string().nullish(),
  id: z.string().nullish(),
});

export type RelyingPartyIdentity = z.infer<typeof relyingPartyIdentitySchema>;
