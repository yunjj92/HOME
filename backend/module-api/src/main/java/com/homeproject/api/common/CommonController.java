package com.homeproject.api.common;

import com.homeproject.api.common.dto.CodeResponse;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.common.CommonQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/common")
public class CommonController {
    private final CommonQueryService commonQueryService;

    @GetMapping(value = "/get_codes")
    public ApiResponse<List<CodeResponse>> getCodes(@RequestParam int typeId) {
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
}
