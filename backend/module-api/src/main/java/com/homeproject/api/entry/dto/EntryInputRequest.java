package com.homeproject.api.entry.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record EntryInputRequest(
        @NotEmpty List<@Valid EntryUpdateRequest> entryUpdateRequests,
        List<@Valid SourceUpdateRequest> sourceUpdateRequests,
        List<@Valid TagUpdateRequest> tagUpdateRequests
) {};
