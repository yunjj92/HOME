package com.homeproject.api.account;

import com.homeproject.api.account.dto.AccountResponse;
import com.homeproject.api.account.dto.AccountUpdateRequest;
import com.homeproject.api.account.dto.BankResponse;
import com.homeproject.api.account.dto.BankUpdateRequest;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.business.account.AccountCommandService;
import com.homeproject.business.account.AccountQueryService;
import com.homeproject.business.account.dto.AccountParam;
import com.homeproject.business.account.dto.BankParam;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class AccountController {

    private final AccountQueryService accountQueryService;
    private final AccountCommandService accountCommandService;

    private AccountParam toAccountParam(
            AccountUpdateRequest accountUpdateRequest
            , String requestedBy
    ) {
        return new AccountParam(
                accountUpdateRequest.id(),
                accountUpdateRequest.bankId(),
                accountUpdateRequest.accountType(),
                accountUpdateRequest.name(),
                accountUpdateRequest.owner(),
                accountUpdateRequest.currencyType(),
                accountUpdateRequest.accountNumber(),
                accountUpdateRequest.description(),
                requestedBy,
                accountUpdateRequest.toDelete()
        );
    }

    private BankParam toBankParam(
            BankUpdateRequest bankUpdateRequest
            , String requestedBy
    ) {
        return new BankParam(
                bankUpdateRequest.id(),
                bankUpdateRequest.name(),
                requestedBy,
                bankUpdateRequest.toDelete()
        );
    }

    @GetMapping(value = "/get_accounts")
    public ApiResponse<List<AccountResponse>> getAccounts() {
        try {
            return ApiResponse.success(
                    accountQueryService.getAccountList()
                    .stream()
                    .map(AccountResponse::from)
                    .toList()
            );
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping(value = "/update_accounts")
    public ApiResponse<Void> updateAccounts(
            @RequestBody List<AccountUpdateRequest> accountUpdateRequests
            , Principal principal
    ) {
        List<AccountParam> accountParams = accountUpdateRequests.stream()
                .map(request -> toAccountParam(request, principal.getName()))
                .toList();
        accountCommandService.saveAccounts(accountParams);

        return ApiResponse.success(null);
    }

    @GetMapping(value = "/get_banks")
    public ApiResponse<List<BankResponse>> getBanks() {
        try {
            return ApiResponse.success(accountQueryService.getBankList()
                    .stream()
                    .map(BankResponse::from)
                    .toList()
            );
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping(value = "/update_banks")
    public ApiResponse<Void> updateBanks(
            @RequestBody List<BankUpdateRequest> bankUpdateRequests
            , Principal principal
    ) {
        List<BankParam> bankParams = bankUpdateRequests.stream()
                    .map(request -> toBankParam(request, principal.getName()))
                    .toList();
        accountCommandService.saveBanks(bankParams);

        return ApiResponse.success(null);
    }
}
