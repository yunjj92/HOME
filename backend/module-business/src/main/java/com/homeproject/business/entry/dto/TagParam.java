package com.homeproject.business.entry.dto;

public record TagParam(
        Integer id,
        String name,
        String requestedBy,
        boolean toDelete,
        Integer clientKey
) {};
