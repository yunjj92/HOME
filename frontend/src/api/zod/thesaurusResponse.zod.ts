import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const thesaurusResponseSchema = z.object({
  accountId: z.number().optional(),
  merchant: z.string().optional(),
  ministryId: z.number().optional(),
  tagId: z.number().nullable().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const thesaurusDataSchema = thesaurusResponseSchema;

export const initThesaurusResponseSchema =
  createApiResponseSchema(thesaurusDataSchema);

export type ThesaurusData = z.infer<
  typeof thesaurusDataSchema
>;

export type InitThesaurusResponse = z.infer<
  typeof initThesaurusResponseSchema
>;
