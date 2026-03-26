package com.homeproject.business.account.dto;

import com.homeproject.db.accounts.dto.AccountProjection;

import java.time.LocalDateTime;

public record AccountResult(
        Integer id,
        Integer bankId,
        String bankName,
        String accountType,
        String name,
        String owner,
        String currencyType,
        String accountNumber,
        String description,
        LocalDateTime createdAt,
        String createdBy,
        LocalDateTime updatedAt,
        String updatedBy
) {
    public static AccountResult from(AccountProjection p) {
        return new AccountResult(
            p.id()
            , p.bankId()
            , p.bankName()
            , p.accountType()
            , p.name()
            , p.owner()
            , p.currencyType()
            , p.accountNumber()
            , p.description()
            , p.createdAt()
            , p.createdBy()
            , p.updatedAt()
            , p.updatedBy()
        );
    }
}
