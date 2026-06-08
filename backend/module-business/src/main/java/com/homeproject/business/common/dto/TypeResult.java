package com.homeproject.business.common.dto;

import com.homeproject.db.common.dto.TypeProjection;

import java.time.LocalDateTime;

public record TypeResult(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static TypeResult from(TypeProjection p) {
        return new TypeResult(
                p.id()
                , p.name()
                , p.description()
                , p.createdAt()
                , p.createdBy()
                , p.updatedAt()
                , p.updatedBy()
        );
    }
}
