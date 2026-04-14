import { z } from "zod";
import { createApiResponseSchema } from "../common/api";
import { accountSchema } from "./account";
import { bankSchema } from "./bank";

/**
 * 계좌 관리 화면에서 사용하는 payload (data 영역)
 * - 계좌 목록 + 은행 목록을 함께 사용하는 조합 데이터
 */
export const accountManagementDataSchema = z.object({
  accountResultList: z.array(accountSchema),
  bankResultList: z.array(bankSchema),
});

/**
 * API 전체 응답 스키마
 * ApiResponse<AccountManagementData>
 */
export const initAccountManagementResponseSchema =
  createApiResponseSchema(accountManagementDataSchema);

/**
 * 타입 추출 (화면에서 주로 사용)
 */
export type AccountManagementData = z.infer<
  typeof accountManagementDataSchema
>;

/**
 * 전체 응답 타입 (필요 시 사용)
 */
export type InitAccountManagementResponse = z.infer<
  typeof initAccountManagementResponseSchema
>;