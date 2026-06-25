package com.homeproject.api.entry.dto;

import com.homeproject.business.entry.dto.ThesaurusResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record ThesaurusResponse(
        Integer accountId,
        String merchant,
        Integer ministryId,
        @Schema(nullable = true)
        Integer tagId,
        @Schema(nullable = true)
        String tagName,
        LocalDateTime createdAt,
        String createdBy,
        @Schema(nullable = true)
        LocalDateTime updatedAt,
        @Schema(nullable = true)
        String updatedBy
) {
    public static ThesaurusResponse from(ThesaurusResult p) {
        return new ThesaurusResponse(
                p.accountId()
                , p.merchant()
                , p.ministryId()
                , p.tagId()
                , p.tagName()
                , p.createdAt()
                , p.createdBy()
                , p.updatedAt()
                , p.updatedBy()
        );
    }
}
