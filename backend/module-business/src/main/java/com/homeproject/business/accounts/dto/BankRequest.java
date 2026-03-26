package com.homeproject.business.accounts.dto;

public record BankRequest(
        Integer id,
        String name,
        String requestedBy,
        boolean toDelete
) {};
