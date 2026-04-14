package com.homeproject.api.account.dto;

public record BankUpdateRequest(
        Integer id,
        String name,
        String requestedBy,
        boolean toDelete
) {};
