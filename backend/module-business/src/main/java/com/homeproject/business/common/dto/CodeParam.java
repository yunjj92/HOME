package com.homeproject.business.common.dto;

public record CodeParam(
        Integer id,
        Integer typeId,
        String code,
        String name,
        String description,
        String requestedBy,
        boolean toDelete
) {};
