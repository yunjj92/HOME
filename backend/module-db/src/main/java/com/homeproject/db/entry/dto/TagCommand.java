package com.homeproject.db.entry.dto;


public record TagCommand(
        Integer id,
        String name,
        String requestedBy
) {};
