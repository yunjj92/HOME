package com.homeproject.business.entry.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EntryParam(
        Integer id,
        Integer accountId,
        LocalDate date,
        BigDecimal amount,
        String memo,
        String connection,
        Integer ministryId,
        String tagName,
        String requestedBy,
        String entryType,
        boolean toDelete
) {};
