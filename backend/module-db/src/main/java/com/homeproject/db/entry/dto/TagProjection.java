package com.homeproject.db.entry.dto;


import java.time.LocalDateTime;

public record TagProjection(
        Integer id,
        String name,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {};
