package com.homeproject.api.account;

import com.homeproject.api.account.dto.AccountManagementResponse;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.account.AccountCommandService;
import com.homeproject.business.account.AccountQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/account")
public class AccountController {

    private final AccountQueryService accountQueryService;
    private final AccountCommandService accountCommandService;

    @GetMapping("/init")
    public ApiResponse<AccountManagementResponse> initAccountManagement() {
        AccountManagementResponse accountManagementResponse = new AccountManagementResponse(
                accountQueryService.getAccountList(),
                accountQueryService.getBankList()
        );

        return ApiResponse.success(accountManagementResponse);
    }
}
