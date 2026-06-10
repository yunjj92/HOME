package com.homeproject.db.entry.dto;

public record IncomeCommand(
        Integer entryId,
        Integer sourceId,
        String requestedBy
) {};
