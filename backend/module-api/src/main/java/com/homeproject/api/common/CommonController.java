package com.homeproject.api.common;

import com.homeproject.api.common.dto.CodeResponse;
import com.homeproject.api.common.dto.CodeUpdateRequest;
import com.homeproject.api.common.dto.TypeResponse;
import com.homeproject.api.common.dto.TypeUpdateRequest;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.common.CommonCommandService;
import com.homeproject.business.common.CommonQueryService;
import com.homeproject.business.common.dto.CodeParam;
import com.homeproject.business.common.dto.TypeParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/common")
public class CommonController {
    private final CommonQueryService commonQueryService;
    private final CommonCommandService commonCommandService;

    private CodeParam toCodeParam(
            CodeUpdateRequest codeUpdateRequest
            , String requestedBy
    ) {
        return new CodeParam(
                codeUpdateRequest.id(),
                codeUpdateRequest.typeId(),
                codeUpdateRequest.code(),
                codeUpdateRequest.name(),
                codeUpdateRequest.description(),
                requestedBy,
                codeUpdateRequest.toDelete()
        );
    }

    private TypeParam toTypeParam(
            TypeUpdateRequest typeUpdateRequest
            , String requestedBy
    ) {
        return new TypeParam(
                typeUpdateRequest.id(),
                typeUpdateRequest.name(),
                typeUpdateRequest.description(),
                requestedBy,
                typeUpdateRequest.toDelete()
        );
    }

    @GetMapping(value = "/get_codes")
    public ApiResponse<List<CodeResponse>> getCodes(@RequestParam(required = false) Integer typeId) {
        try {
            return ApiResponse.success(
                    commonQueryService.getCodeList(typeId)
                            .stream()
                            .map(CodeResponse::from)
                            .toList()
            );
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @GetMapping(value = "/get_types")
    public ApiResponse<List<TypeResponse>> getTypes() {
        try {
            return ApiResponse.success(
                    commonQueryService.getTypeList()
                            .stream()
                            .map(TypeResponse::from)
                            .toList()
            );
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping(value = "/update_codes")
    public ApiResponse<Void> updateCodes(
            @RequestBody List<CodeUpdateRequest> codeUpdateRequests
            , Principal principal
    ) {
        try {
            List<CodeParam> codeParams = codeUpdateRequests.stream()
                    .map(request -> toCodeParam(request, principal.getName()))
                    .toList();
            commonCommandService.saveCodes(codeParams);

            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping(value = "/update_types")
    public ApiResponse<Void> updateTypes(
            @RequestBody List<TypeUpdateRequest> typeUpdateRequests
            , Principal principal
    ) {
        try {
            List<TypeParam> typeParams = typeUpdateRequests.stream()
                    .map(request -> toTypeParam(request, principal.getName()))
                    .toList();
            commonCommandService.saveTypes(typeParams);

            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }
}
