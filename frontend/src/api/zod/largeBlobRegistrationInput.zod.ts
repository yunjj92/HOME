import { z } from 'zod';

export const largeBlobRegistrationInputSchema = z.object({
  support: z.string().nullish(),
});

export type LargeBlobRegistrationInput = z.infer<typeof largeBlobRegistrationInputSchema>;
