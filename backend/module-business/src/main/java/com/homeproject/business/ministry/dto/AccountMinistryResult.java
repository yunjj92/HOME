package com.homeproject.business.ministry.dto;

import com.homeproject.db.ministry.dto.AccountMinistryProjection;

import java.time.LocalDateTime;

public record AccountMinistryResult(
        Integer accountId,
        Integer id,
        String name,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static AccountMinistryResult from(AccountMinistryProjection p) {
        return new AccountMinistryResult(
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
