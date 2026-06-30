package com.homeproject.api.ministry;

import com.homeproject.api.ministry.dto.MinistryResponse;
import com.homeproject.api.ministry.dto.MinistryUpdateRequest;
import com.homeproject.api.support.wrapper.ApiResponse;
import com.homeproject.business.ministry.MinistryCommandService;
import com.homeproject.business.ministry.MinistryQueryService;
import com.homeproject.business.ministry.dto.MinistryParam;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class MinistryController {

    private final MinistryQueryService ministryQueryService;
    private final MinistryCommandService ministryCommandService;

    private MinistryParam toMinistryParam(
            MinistryUpdateRequest ministryUpdateRequest
            , String requestedBy
    ) {
        return new MinistryParam(
                ministryUpdateRequest.id(),
                ministryUpdateRequest.name(),
                ministryUpdateRequest.description(),
                requestedBy,
                ministryUpdateRequest.toDelete()
        );
    }

    @GetMapping(value = "/get_ministries")
    public ApiResponse<List<MinistryResponse>> getMinistries() {
        return ApiResponse.success(
                ministryQueryService.getMinistryList()
                .stream()
                .map(MinistryResponse::from)
                .toList()
        );
    }

    @PostMapping(value = "/update_ministries")
    public ApiResponse<Void> updateMinistries(
            @RequestBody @Valid List<@Valid MinistryUpdateRequest> ministryUpdateRequests
            , Principal principal
    ) {
        List<MinistryParam> ministryParams = ministryUpdateRequests.stream()
                .map(request -> toMinistryParam(request, principal.getName()))
                .toList();
        ministryCommandService.saveMinistries(ministryParams);

        return ApiResponse.success(null);
    }
}
