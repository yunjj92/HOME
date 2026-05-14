package com.homeproject.api.ministry.dto;

public record MinistryUpdateRequest(
        Integer id,
        String name,
        String description,
        String requestedBy,
        boolean toDelete
) {};
