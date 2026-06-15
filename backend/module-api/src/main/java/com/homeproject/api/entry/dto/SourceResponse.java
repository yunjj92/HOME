package com.homeproject.api.entry.dto;

import com.homeproject.business.entry.dto.SourceResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record SourceResponse(
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
    public static SourceResponse from(SourceResult p) {
        return new SourceResponse(
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
