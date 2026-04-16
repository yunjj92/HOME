import { z } from 'zod';
import { appIdSchema } from './appId.zod';
import { largeBlobRegistrationInputSchema } from './largeBlobRegistrationInput.zod';

export const registrationExtensionInputsSchema = z.object({
  appidExclude: appIdSchema.nullish(),
  credProps: z.boolean().nullish(),
  largeBlob: largeBlobRegistrationInputSchema.nullish(),
  uvm: z.boolean().nullish(),
});

export type RegistrationExtensionInputs = z.infer<typeof registrationExtensionInputsSchema>;
