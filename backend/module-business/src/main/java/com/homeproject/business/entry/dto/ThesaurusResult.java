package com.homeproject.business.entry.dto;

import com.homeproject.db.entry.dto.ThesaurusProjection;

import java.time.LocalDateTime;

public record ThesaurusResult(
        Integer accountId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        String tagName,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static ThesaurusResult from(ThesaurusProjection p) {
        return new ThesaurusResult(
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
