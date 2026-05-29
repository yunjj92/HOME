import { z } from "zod";

export const bankRequestSchema = z.object({
  id: z.number().nullable().transform((value) => value ?? undefined),
  name: z.string().trim().min(1, "은행명이 입력되지 않았습니다."),
  requestedBy: z.string(),
  toDelete: z.boolean(),
});

export type BankRequest = z.infer<typeof bankRequestSchema>;