package com.homeproject.business.account.dto;

public record AccountParam(
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
