import { z } from 'zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const bankResponseSchema = z.object({
  id: z.number().nullish(),
  name: z.string().nullish(),
  createdAt: z.string().nullish(),
  createdBy: z.string().nullish(),
  updatedAt: z.string().nullish(),
  updatedBy: z.string().nullish(),
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
