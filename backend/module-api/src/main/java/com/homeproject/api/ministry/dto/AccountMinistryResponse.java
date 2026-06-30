package com.homeproject.api.ministry.dto;

import com.homeproject.business.ministry.dto.AccountMinistryResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record AccountMinistryResponse(
        Integer accountId,
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
    public static AccountMinistryResponse from(AccountMinistryResult p) {
        return new AccountMinistryResponse(
            p.accountId()
            , p.id()
            , p.name()
            , p.description()
            , p.createdAt()
            , p.createdBy()
            , p.updatedAt()
            , p.updatedBy()
        );
    }
}
