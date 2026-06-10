package com.homeproject.db.entry.dto;


public record ExpenseCommand(
        Integer entryId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        String requestedBy
) {};
