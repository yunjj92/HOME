package com.homeproject.business.common.dto;

import com.homeproject.db.common.dto.CodeProjection;

import java.time.LocalDateTime;

public record CodeResult(
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
    public static CodeResult from(CodeProjection p) {
        return new CodeResult(
                p.id()
                , p.type_id()
                , p.code()
                , p.name()
                , p.description()
                , p.createdAt()
                , p.createdBy()
                , p.updatedAt()
                , p.updatedBy()
        );
    }
}
