import { z } from 'zod';
import { createApiResponseSchema } from '../../services/schemas/common/api';

export const accountResponseSchema = z.object({
  id: z.number().optional(),
  bankId: z.number().optional(),
  bankName: z.string().optional(),
  accountType: z.string().optional(),
  name: z.string().optional(),
  owner: z.string().optional(),
  currencyType: z.string().optional(),
  accountNumber: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const accountDataSchema = accountResponseSchema;

export const initAccountResponseSchema =
  createApiResponseSchema(accountDataSchema);

export type AccountData = z.infer<
  typeof accountDataSchema
>;

export type InitAccountResponse = z.infer<
  typeof initAccountResponseSchema
>;
