package com.homeproject.api.account;

import com.homeproject.api.account.dto.AccountManagementResponse;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.account.AccountCommandService;
import com.homeproject.business.account.AccountQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/account")
public class AccountController {

    private final AccountQueryService accountQueryService;
    private final AccountCommandService accountCommandService;

    @GetMapping(value = "/init")
    public ApiResponse<AccountManagementResponse> initAccountManagement() {

        try {
            AccountManagementResponse accountManagementResponse = new AccountManagementResponse(
            accountQueryService.getAccountList(),
                    accountQueryService.getBankList()
            );
            return ApiResponse.success(accountManagementResponse);
        }catch (Exception e){
            return ApiResponse.error(e.getMessage(), "");
        }
    }
}
