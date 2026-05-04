package com.homeproject.db.account.dto;

public record BankCommand(
        Integer id,
        String name,
        String requestedBy
) {};
