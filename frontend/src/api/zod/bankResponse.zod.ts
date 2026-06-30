import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const bankResponseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export const bankDataSchema = bankResponseSchema;

export const initBankResponseSchema =
  createApiResponseSchema(bankDataSchema);

export type BankData = z.infer<
  typeof bankDataSchema
>;

export type InitBankResponse = z.infer<
  typeof initBankResponseSchema
>;
