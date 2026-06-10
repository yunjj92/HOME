package com.homeproject.db.entry.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public record EntryCommand(
        Integer id,
        Integer accountId,
        LocalDate date,
        BigDecimal amount,
        String memo,
        String requestedBy
) {};
