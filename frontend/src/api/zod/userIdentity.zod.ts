import { z } from 'zod';

export const userIdentitySchema = z.object({
  name: z.string().nullish(),
  displayName: z.string().nullish(),
  id: z.string().nullish(),
});

export type UserIdentity = z.infer<typeof userIdentitySchema>;
