package com.homeproject.db.entry.dto;


public record SourceCommand(
        Integer id,
        String name,
        String description,
        String requestedBy
) {};
