package com.homeproject.api.entry.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EntryUpdateRequest(
        Integer id,
        @NotNull Integer accountId,
        @NotNull LocalDate date,
        @NotNull @DecimalMin("0") BigDecimal amount,
        String memo,
        Integer sourceId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        @NotNull @Pattern(regexp = "income|expense") String entryType,
        boolean toDelete
) {};
