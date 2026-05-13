import { z } from 'zod';

export const userIdentitySchema = z.object({
  name: z.string().optional(),
  displayName: z.string().optional(),
  id: z.string().optional(),
});

export type UserIdentity = z.infer<typeof userIdentitySchema>;
