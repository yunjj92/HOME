package com.homeproject.business.account.dto;

public record BankRequest(
        Integer id,
        String name,
        String requestedBy,
        boolean toDelete
) {};
