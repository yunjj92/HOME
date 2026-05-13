import { z } from 'zod';

export const largeBlobRegistrationInputSchema = z.object({
  support: z.string().optional(),
});

export type LargeBlobRegistrationInput = z.infer<typeof largeBlobRegistrationInputSchema>;
