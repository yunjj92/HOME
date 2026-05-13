import { z } from 'zod';
import { appIdSchema } from './appId.zod';
import { largeBlobRegistrationInputSchema } from './largeBlobRegistrationInput.zod';

export const registrationExtensionInputsSchema = z.object({
  appidExclude: appIdSchema.optional(),
  credProps: z.boolean().optional(),
  largeBlob: largeBlobRegistrationInputSchema.optional(),
  uvm: z.boolean().optional(),
});

export type RegistrationExtensionInputs = z.infer<typeof registrationExtensionInputsSchema>;
