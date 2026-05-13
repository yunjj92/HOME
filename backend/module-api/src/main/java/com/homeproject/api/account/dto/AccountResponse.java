package com.homeproject.api.account.dto;

import com.homeproject.business.account.dto.AccountResult;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record AccountResponse(
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
        @Schema(nullable = true)
        LocalDateTime updatedAt,
        @Schema(nullable = true)
        String updatedBy
) {
    public static AccountResponse from(AccountResult p) {
        return new AccountResponse(
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
