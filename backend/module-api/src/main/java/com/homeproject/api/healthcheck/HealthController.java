package com.homeproject.api.healthcheck;

import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.healthcheck.MemberReadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "HealthCheck", description = "서버 상태 점검") // 이미지의 'pet'처럼 그룹화
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    private final MemberReadService memberReadService;

    @Operation(
            summary = "서버 점검",
            description = "백엔드 서버가 on 상태인지, db가 정상적으로 연결되어 있는지 체크합니다."
    )
    @GetMapping("/healthcheck")
    public ApiResponse<String> healthCheck() {
        boolean result = memberReadService.saveReadFirst(2345);
        return ApiResponse.success("Server is running! And DB server is on? " + result);
    }
}
