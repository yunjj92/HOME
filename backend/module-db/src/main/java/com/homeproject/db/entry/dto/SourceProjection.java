package com.homeproject.db.entry.dto;

import java.time.LocalDateTime;

public record SourceProjection(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
};
