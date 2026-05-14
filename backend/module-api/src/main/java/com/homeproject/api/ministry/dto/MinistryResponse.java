package com.homeproject.api.ministry.dto;

import com.homeproject.business.ministry.dto.MinistryResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record MinistryResponse(
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
    public static MinistryResponse from(MinistryResult p) {
        return new MinistryResponse(
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
