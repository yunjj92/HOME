package com.homeproject.api.entry.dto;

import jakarta.validation.constraints.Negative;
import jakarta.validation.constraints.NotBlank;

public record TagUpdateRequest(
        Integer id,
        @NotBlank String name,
        boolean toDelete,
        @Negative Integer clientKey
) {};
