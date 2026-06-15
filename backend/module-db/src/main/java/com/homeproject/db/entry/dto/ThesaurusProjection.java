package com.homeproject.db.entry.dto;

import java.time.LocalDateTime;

public record ThesaurusProjection(
        Integer accountId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
};
