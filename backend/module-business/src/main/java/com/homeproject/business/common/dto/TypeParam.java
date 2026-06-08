package com.homeproject.business.common.dto;

public record TypeParam(
        Integer id,
        String name,
        String description,
        String requestedBy,
        boolean toDelete
) {};
