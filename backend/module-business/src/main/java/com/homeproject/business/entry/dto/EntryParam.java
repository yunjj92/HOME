package com.homeproject.business.entry.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EntryParam(
        Integer id,
        Integer accountId,
        LocalDate date,
        BigDecimal amount,
        String memo,
        Integer sourceId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        String requestedBy,
        String entryType,
        boolean toDelete
) {};
