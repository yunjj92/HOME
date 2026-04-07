package com.homeproject.business.account.dto;

import com.homeproject.db.accounts.dto.BankProjection;

import java.time.LocalDateTime;

public record BankResult(
        Integer id,
        String name,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static BankResult from(BankProjection p) {
        return new BankResult(
            p.id()
            , p.name()
            , p.createdAt()
            , p.createdBy()
            , p.updatedAt()
            , p.updatedBy()
        );
    }
}
