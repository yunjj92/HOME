import { z } from 'zod';

export const finalizedRegistrationRequestSchema = z.object({
  username: z.string().optional(),
  responseJson: z.string().optional(),
});

export type FinalizedRegistrationRequest = z.infer<typeof finalizedRegistrationRequestSchema>;
