import { z } from "zod";

// API 에러
export const apiErrorSchema = z.object({
   message: z.string(),
   code: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// 다른 에러 스키마 추가 예정
