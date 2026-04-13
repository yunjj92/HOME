import { z } from 'zod';

export const appIdSchema = z.object({
  id: z.string().nullish(),
});

export type AppId = z.infer<typeof appIdSchema>;
