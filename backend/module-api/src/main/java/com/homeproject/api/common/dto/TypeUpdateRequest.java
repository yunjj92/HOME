package com.homeproject.api.common.dto;

public record TypeUpdateRequest(
        Integer id,
        String name,
        String description,
        boolean toDelete
) {};
