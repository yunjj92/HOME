import { z } from 'zod';
import { entryUpdateRequestSchema } from './entryUpdateRequest.zod';
import { sourceUpdateRequestSchema } from './sourceUpdateRequest.zod';
import { tagUpdateRequestSchema } from './tagUpdateRequest.zod';

export const entryInputRequestSchema = z.object({
  entryUpdateRequests: z.array(entryUpdateRequestSchema),
  sourceUpdateRequests: z.array(sourceUpdateRequestSchema).optional(),
  tagUpdateRequests: z.array(tagUpdateRequestSchema).optional(),
});

export type EntryInputRequest = z.infer<typeof entryInputRequestSchema>;
