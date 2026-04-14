package com.homeproject.api.account;

import com.homeproject.api.account.dto.AccountManagementResponse;
import com.homeproject.api.account.dto.BankUpdateRequest;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.account.AccountCommandService;
import com.homeproject.business.account.AccountQueryService;
import com.homeproject.business.account.dto.BankParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping(value = "/update_banks")
    public ApiResponse<Void> updateBanks(@RequestBody List<BankUpdateRequest> bankUpdateRequests) {
        List<BankParam> bankParams = bankUpdateRequests.stream()
                    .map(this::toBankParam)
                    .toList();
        accountCommandService.saveBanks(bankParams);

        return ApiResponse.success(null);
    }
}
