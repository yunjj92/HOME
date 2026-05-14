package com.homeproject.business.ministry.dto;

import com.homeproject.db.ministry.dto.MinistryProjection;

import java.time.LocalDateTime;

public record MinistryResult(
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static MinistryResult from(MinistryProjection p) {
        return new MinistryResult(
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
