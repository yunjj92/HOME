package com.homeproject.business.account.dto;

public record AccountRequest(
        Integer id,
        Integer bankId,
        String accountType,
        String name,
        String owner,
        String currencyType,
        String accountNumber,
        String description,
        String requestedBy,
        boolean toDelete
) {};
