import { z } from 'zod';

export const finalizedRegistrationRequestSchema = z.object({
  username: z.string().nullish(),
  responseJson: z.string().nullish(),
});

export type FinalizedRegistrationRequest = z.infer<typeof finalizedRegistrationRequestSchema>;
