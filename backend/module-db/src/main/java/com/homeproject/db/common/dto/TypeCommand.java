package com.homeproject.db.common.dto;

public record TypeCommand(
        Integer id,
        String name,
        String description,
        String requestedBy
) {
};
