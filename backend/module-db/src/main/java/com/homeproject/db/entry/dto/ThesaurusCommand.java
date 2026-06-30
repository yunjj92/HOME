package com.homeproject.db.entry.dto;


public record ThesaurusCommand(
        Integer accountId,
        String merchant,
        Integer ministryId,
        Integer tagId,
        String requestedBy
) {};
