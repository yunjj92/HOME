package com.homeproject.api.account.dto;

import com.homeproject.business.account.dto.AccountResult;
import com.homeproject.business.account.dto.BankResult;

import java.util.List;

public record AccountManagementResponse(
        List<AccountResult> accountResultList,
        List<BankResult> bankResultList
) {
}
