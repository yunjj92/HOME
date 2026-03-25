package com.homeproject.db.accounts.dto;

import java.time.LocalDateTime;

public record AccountProjection(
        Integer id,
        Integer bankId,
        String bankName,
        String accountType,
        String name,
        String owner,
        String currencyType,
        String accountNumber,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {};
