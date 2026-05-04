package com.homeproject.db.common.dto;

import java.time.LocalDateTime;

public record CodeProjection(
        Integer id,
        Integer type_id,
        String code,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
};
