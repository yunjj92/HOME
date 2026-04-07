package com.homeproject.business.account.dto;

public record BankParam(
        Integer id,
        String name,
        String requestedBy,
        boolean toDelete
) {};
