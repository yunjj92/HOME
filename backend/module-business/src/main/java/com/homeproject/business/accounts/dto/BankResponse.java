package com.homeproject.business.accounts.dto;

import com.homeproject.db.accounts.dto.AccountProjection;
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
    public static BankResponse from(BankProjection p) {
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
