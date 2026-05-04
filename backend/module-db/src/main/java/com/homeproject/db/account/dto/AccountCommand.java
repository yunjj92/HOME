package com.homeproject.db.account.dto;


public record AccountCommand(
        Integer id,
        Integer bankId,
        String accountType,
        String name,
        String owner,
        String currencyType,
        String accountNumber,
        String description,
        String requestedBy
) {};
