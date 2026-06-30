package com.homeproject.api.support.exception;

import com.homeproject.api.support.wrapper.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException e) {
        ApiErrorCode errorCode = e.getErrorCode();

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ApiResponse.error(e.getMessage(), errorCode.getCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e
    ) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("\n"));

        return ResponseEntity
                .status(ApiErrorCode.VALIDATION_FAILED.getStatus())
                .body(ApiResponse.error(message, ApiErrorCode.VALIDATION_FAILED.getCode()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(
            ConstraintViolationException e
    ) {
        String message = e.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining("\n"));

        return ResponseEntity
                .status(ApiErrorCode.VALIDATION_FAILED.getStatus())
                .body(ApiResponse.error(message, ApiErrorCode.VALIDATION_FAILED.getCode()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e
    ) {
        log.warn("Failed to read request body", e);

        return ResponseEntity
                .status(ApiErrorCode.COMMON_BAD_REQUEST.getStatus())
                .body(ApiResponse.error(
                        "\uC694\uCCAD \uBCF8\uBB38\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
                        ApiErrorCode.COMMON_BAD_REQUEST.getCode()
                ));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e
    ) {
        String message = "\uD544\uC218 \uC694\uCCAD \uD30C\uB77C\uBBF8\uD130\uAC00 \uB204\uB77D\uB418\uC5C8\uC2B5\uB2C8\uB2E4: "
                + e.getParameterName();

        return ResponseEntity
                .status(ApiErrorCode.COMMON_BAD_REQUEST.getStatus())
                .body(ApiResponse.error(message, ApiErrorCode.COMMON_BAD_REQUEST.getCode()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(
            IllegalArgumentException e
    ) {
        return ResponseEntity
                .status(ApiErrorCode.COMMON_BAD_REQUEST.getStatus())
                .body(ApiResponse.error(e.getMessage(), ApiErrorCode.COMMON_BAD_REQUEST.getCode()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unhandled exception", e);

        return ResponseEntity
                .status(ApiErrorCode.COMMON_INTERNAL_ERROR.getStatus())
                .body(ApiResponse.error(
                        ApiErrorCode.COMMON_INTERNAL_ERROR.getMessage(),
                        ApiErrorCode.COMMON_INTERNAL_ERROR.getCode()
                ));
    }
}
