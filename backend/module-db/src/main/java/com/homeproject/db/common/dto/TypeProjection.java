package com.homeproject.db.common.dto;

import java.time.LocalDateTime;

public record TypeProjection(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
};
