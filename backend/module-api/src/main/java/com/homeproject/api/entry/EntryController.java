package com.homeproject.api.entry;

import com.homeproject.api.entry.dto.EntryInputRequest;
import com.homeproject.api.entry.dto.EntryUpdateRequest;
import com.homeproject.api.entry.dto.SourceUpdateRequest;
import com.homeproject.api.entry.dto.TagUpdateRequest;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.entry.EntryCommandService;
import com.homeproject.business.entry.dto.EntryParam;
import com.homeproject.business.entry.dto.SourceParam;
import com.homeproject.business.entry.dto.TagParam;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/entry")
public class EntryController {

    private final EntryCommandService entryCommandService;

    private EntryParam toEntryParam(
            EntryUpdateRequest entryUpdateRequest,
            String requestedBy
    ) {
        return new EntryParam(
                entryUpdateRequest.id(),
                entryUpdateRequest.accountId(),
                entryUpdateRequest.date(),
                entryUpdateRequest.amount(),
                entryUpdateRequest.memo(),
                entryUpdateRequest.sourceId(),
                entryUpdateRequest.merchant(),
                entryUpdateRequest.ministryId(),
                entryUpdateRequest.tagId(),
                requestedBy,
                entryUpdateRequest.entryType(),
                entryUpdateRequest.toDelete()
        );
    }

    private SourceParam toSourceParam(
            SourceUpdateRequest sourceUpdateRequest,
            String requestedBy
    ) {
        return new SourceParam(
                sourceUpdateRequest.id(),
                sourceUpdateRequest.name(),
                sourceUpdateRequest.description(),
                requestedBy,
                sourceUpdateRequest.toDelete(),
                sourceUpdateRequest.clientKey()
        );
    }

    private TagParam toTagParam(
            TagUpdateRequest tagUpdateRequest,
            String requestedBy
    ) {
        return new TagParam(
                tagUpdateRequest.id(),
                tagUpdateRequest.name(),
                requestedBy,
                tagUpdateRequest.toDelete(),
                tagUpdateRequest.clientKey()
        );
    }

    @PostMapping(value = "/update_entries")
    public ApiResponse<Void> updateEntries(
            @Valid @RequestBody EntryInputRequest entryInputRequest,
            Principal principal
    ) {
        String requestBy = principal.getName();

        List<EntryUpdateRequest> entryUpdateRequests = entryInputRequest.entryUpdateRequests();
        List<SourceUpdateRequest> sourceUpdateRequests = Objects.requireNonNullElse(entryInputRequest.sourceUpdateRequests(), List.of());
        List<TagUpdateRequest> tagUpdateRequests = Objects.requireNonNullElse(entryInputRequest.tagUpdateRequests(), List.of());

        entryCommandService.saveEntries(
                entryUpdateRequests.stream().map(request -> toEntryParam(request, requestBy)).toList(),
                sourceUpdateRequests.stream().map(request -> toSourceParam(request, requestBy)).toList(),
                tagUpdateRequests.stream().map(request -> toTagParam(request, requestBy)).toList()
        );

        return ApiResponse.success(null);
    }
}
