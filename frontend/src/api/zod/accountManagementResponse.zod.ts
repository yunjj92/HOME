import { z } from 'zod';
import { accountResultSchema } from './accountResult.zod';
import { bankResultSchema } from './bankResult.zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const accountManagementResponseSchema = z.object({
  accountResultList: z.array(accountResultSchema).optional(),
  bankResultList: z.array(bankResultSchema).optional(),
});

export const accountManagementDataSchema = accountManagementResponseSchema;

export const initAccountManagementResponseSchema =
  createApiResponseSchema(accountManagementDataSchema);

export type AccountManagementData = z.infer<
  typeof accountManagementDataSchema
>;

export type InitAccountManagementResponse = z.infer<
  typeof initAccountManagementResponseSchema
>;
