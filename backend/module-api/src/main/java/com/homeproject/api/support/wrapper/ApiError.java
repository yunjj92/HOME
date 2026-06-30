package com.homeproject.api.support.wrapper;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiError {

    private String message;
    private String code;

}
