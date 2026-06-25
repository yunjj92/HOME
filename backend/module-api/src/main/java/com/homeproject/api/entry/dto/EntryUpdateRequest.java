package com.homeproject.api.entry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EntryUpdateRequest(
        Integer id,
        @NotNull Integer accountId,
        @NotNull LocalDate date,
        @NotNull BigDecimal amount,
        String memo,
        @NotBlank String connection,
        Integer ministryId,
        String tagName,
        @NotNull @Pattern(regexp = "inc|exp") String entryType,
        boolean toDelete
) {};
