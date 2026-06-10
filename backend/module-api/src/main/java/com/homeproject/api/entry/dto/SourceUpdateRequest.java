package com.homeproject.api.entry.dto;

import jakarta.validation.constraints.Negative;
import jakarta.validation.constraints.NotBlank;

public record SourceUpdateRequest(
        Integer id,
        @NotBlank String name,
        String description,
        boolean toDelete,
        @Negative Integer clientKey
) {};
