package com.homeproject.api.common.dto;

public record CodeUpdateRequest(
        Integer id,
        Integer typeId,
        String code,
        String name,
        String description,
        boolean toDelete
) {};
