package com.homeproject.db.ministry.dto;

import java.time.LocalDateTime;

public record MinistryProjection(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
};
