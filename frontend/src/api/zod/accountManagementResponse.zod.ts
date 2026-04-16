import { z } from 'zod';
import { accountResultSchema } from './accountResult.zod';
import { bankResultSchema } from './bankResult.zod';
import { createApiResponseSchema } from '../../schemas/common/api';

export const accountManagementResponseSchema = z.object({
  accountResultList: z.array(accountResultSchema).nullish(),
  bankResultList: z.array(bankResultSchema).nullish(),
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
