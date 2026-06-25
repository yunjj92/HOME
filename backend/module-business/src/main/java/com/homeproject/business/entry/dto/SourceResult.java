package com.homeproject.business.entry.dto;

import com.homeproject.db.entry.dto.SourceProjection;

import java.time.LocalDateTime;

public record SourceResult(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static SourceResult from(SourceProjection p) {
        return new SourceResult(
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
