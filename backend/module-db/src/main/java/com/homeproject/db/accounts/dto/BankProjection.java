package com.homeproject.db.accounts.dto;

import java.time.LocalDateTime;

public record BankProjection(
        Integer id,
        String name,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {};
