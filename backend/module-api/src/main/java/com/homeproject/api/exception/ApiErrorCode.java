package com.homeproject.api.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ApiErrorCode {
    COMMON_INTERNAL_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "COMMON_INTERNAL_ERROR",
            "서버 오류가 발생했습니다."
    ),
    COMMON_BAD_REQUEST(
            HttpStatus.BAD_REQUEST,
            "COMMON_BAD_REQUEST",
            "잘못된 요청입니다."
    ),
    VALIDATION_FAILED(
            HttpStatus.BAD_REQUEST,
            "VALIDATION_FAILED",
            "입력값이 올바르지 않습니다."
    ),
    AUTH_LOGIN_FAILED(
            HttpStatus.UNAUTHORIZED,
            "AUTH_LOGIN_FAILED",
            "로그인에 실패했습니다."
    ),
    AUTH_CHALLENGE_EXPIRED(
            HttpStatus.BAD_REQUEST,
            "AUTH_CHALLENGE_EXPIRED",
            "로그인 요청이 만료되었습니다."
    ),
    AUTH_ASSERTION_INVALID(
            HttpStatus.BAD_REQUEST,
            "AUTH_ASSERTION_INVALID",
            "인증 응답이 올바르지 않습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;
}
