package com.homeproject.api.common.dto;

import com.homeproject.business.common.dto.TypeResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record TypeResponse(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        @Schema(nullable = true)
        LocalDateTime updatedAt,
        @Schema(nullable = true)
        String updatedBy
) {
    public static TypeResponse from(TypeResult p) {
        return new TypeResponse(
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
