package com.homeproject.db.ministry.dto;

public record MinistryCommand(
        Integer id,
        String name,
        String description,
        String requestedBy
) {
};
