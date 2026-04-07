package com.homeproject.db.accounts.dto;

public record BankCommand(
        Integer id,
        String name,
        String requestedBy
) {};
