package com.homeproject.api.wrapper;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private final boolean success;
    private final ApiError apiError;
    private final T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null,  data);
    }

    //todo ApiResponse 공통 객체 생성 필요
    public static <T> ApiResponse<T> error(String message, String code) {
        return new ApiResponse<>(false, new ApiError(message, code), null );
    }

}
