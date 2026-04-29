package com.homeproject.api.account.dto;

import com.homeproject.business.account.dto.BankResult;
import com.homeproject.db.accounts.dto.BankProjection;

import java.time.LocalDateTime;

public record BankResponse(
        Integer id,
        String name,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static BankResponse from(BankResult p) {
        return new BankResponse(
            p.id()
            , p.name()
            , p.createdAt()
            , p.createdBy()
            , p.updatedAt()
            , p.updatedBy()
        );
    }
}
