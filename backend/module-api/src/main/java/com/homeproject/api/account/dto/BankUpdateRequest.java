package com.homeproject.api.account.dto;

public record BankUpdateRequest(
        Integer id,
        String name,
        boolean toDelete
) {};
