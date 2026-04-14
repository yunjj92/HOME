package com.homeproject.api.account;

import com.homeproject.api.account.dto.AccountManagementResponse;
import com.homeproject.api.account.dto.BankUpdateRequest;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.account.AccountCommandService;
import com.homeproject.business.account.AccountQueryService;
import com.homeproject.business.account.dto.BankParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/account")
public class AccountController {

    private final AccountQueryService accountQueryService;
    private final AccountCommandService accountCommandService;

    private BankParam toBankParam(BankUpdateRequest bankUpdateRequest) {
        return new BankParam(
                bankUpdateRequest.id(),
                bankUpdateRequest.name(),
                bankUpdateRequest.requestedBy(),
                bankUpdateRequest.toDelete()
        );
    }

    @GetMapping(value = "/init", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<AccountManagementResponse> initAccountManagement() {
        AccountManagementResponse accountManagementResponse = new AccountManagementResponse(
                accountQueryService.getAccountList(),
                accountQueryService.getBankList()
        );

        return ApiResponse.success(accountManagementResponse);
    }

    @PostMapping(value = "/update_banks")
    public ApiResponse<Void> updateBanks(@RequestBody List<BankUpdateRequest> bankUpdateRequests) {
        List<BankParam> bankParams = bankUpdateRequests.stream()
                    .map(this::toBankParam)
                    .toList();
        accountCommandService.saveBanks(bankParams);

        return ApiResponse.success(null);
    }
}
