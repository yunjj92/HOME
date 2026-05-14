package com.homeproject.business.ministry.dto;

public record MinistryParam(
        Integer id,
        String name,
        String description,
        String requestedBy,
        boolean toDelete
) {};
