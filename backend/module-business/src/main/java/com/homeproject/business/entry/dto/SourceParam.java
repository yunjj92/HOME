package com.homeproject.business.entry.dto;

public record SourceParam(
        Integer id,
        String name,
        String description,
        String requestedBy,
        boolean toDelete,
        Integer clientKey
) {};
