package com.homeproject.api.account.dto;

public record AccountUpdateRequest(
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
