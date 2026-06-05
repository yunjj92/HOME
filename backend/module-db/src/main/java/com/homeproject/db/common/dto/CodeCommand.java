package com.homeproject.db.common.dto;


public record CodeCommand(
        Integer id,
        Integer typeId,
        String code,
        String name,
        String description,
        String requestedBy
) {
};
