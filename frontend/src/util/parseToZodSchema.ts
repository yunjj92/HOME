import type { ZodType } from "zod";

export function parseToZodSchema<T>(
    data: unknown,
    schema: ZodType<T>,
    fallback: T,
) {
    // 데이터 존재유무 확인
    if(data == null) return fallback;
    const parsed = schema.safeParse(data);

    // 파싱 에러 확인
    if(parsed.error) {
        alert(parsed.error);
        return fallback;
    }

    // 정상 데이터 반환
    return parsed.data;
}