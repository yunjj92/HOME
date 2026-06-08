package com.homeproject.api.common.dto;

import com.homeproject.business.common.dto.CodeResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record CodeResponse(
        Integer id,
        Integer typeId,
        String code,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        @Schema(nullable = true)
        LocalDateTime updatedAt,
        @Schema(nullable = true)
        String updatedBy
) {
    public static CodeResponse from(CodeResult p) {
        return new CodeResponse(
                p.id()
                , p.typeId()
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
