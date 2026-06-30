package com.homeproject.api.entry;

import com.homeproject.api.entry.dto.EntryUpdateRequest;
import com.homeproject.api.entry.dto.SourceResponse;
import com.homeproject.api.entry.dto.ThesaurusResponse;
import com.homeproject.api.support.wrapper.ApiResponse;
import com.homeproject.business.entry.EntryCommandService;
import com.homeproject.business.entry.EntryQueryService;
import com.homeproject.business.entry.dto.EntryParam;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/entry")
public class EntryController {

    private final EntryQueryService entryQueryService;
    private final EntryCommandService entryCommandService;

    private EntryParam toEntryParam(
            EntryUpdateRequest entryUpdateRequest,
            String requestedBy
    ) {
        String tagName = entryUpdateRequest.tagName();
        return new EntryParam(
                entryUpdateRequest.id(),
                entryUpdateRequest.accountId(),
                entryUpdateRequest.date(),
                entryUpdateRequest.amount(),
                entryUpdateRequest.memo(),
                entryUpdateRequest.connection().trim(),
                entryUpdateRequest.ministryId(),
                tagName == null ? null : tagName.trim(),
                requestedBy,
                entryUpdateRequest.entryType(),
                entryUpdateRequest.toDelete()
        );
    }

    @GetMapping(value = "/get_sources")
    public ApiResponse<List<SourceResponse>> getSources() {
        return ApiResponse.success(
                entryQueryService.getSourceList()
                        .stream()
                        .map(SourceResponse::from)
                        .toList()
        );
    }

    @GetMapping(value = "/get_thesauruses")
    public ApiResponse<List<ThesaurusResponse>> getThesauruses() {
        return ApiResponse.success(
                entryQueryService.getThesaurusList()
                        .stream()
                        .map(ThesaurusResponse::from)
                        .toList()
        );
    }

    @PostMapping(value = "/update_entries")
    public ApiResponse<Void> updateEntries(
            @RequestBody @Valid List<@Valid EntryUpdateRequest> entryUpdateRequests,
            Principal principal
    ) {
        String requestedBy = principal.getName();
        entryCommandService.saveEntries(
                entryUpdateRequests
                        .stream()
                        .map(request -> toEntryParam(request, requestedBy))
                        .toList()
                , requestedBy);

        return ApiResponse.success(null);
    }
}
