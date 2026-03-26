package com.homeproject.business.accounts;

import com.homeproject.business.accounts.dto.AccountResponse;
import com.homeproject.business.accounts.dto.BankResponse;
import com.homeproject.db.accounts.AccountsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class AccountQueryService {

    private final AccountsRepository accountsRepository;

    public List<AccountResponse> getAccountList() {
        return accountsRepository.getAccountList()
                .stream()
                .map(AccountResponse::from)
                .toList();
    }

    public List<BankResponse> getBankList() {
        return accountsRepository.getBankList()
                .stream()
                .map(BankResponse::from)
                .toList();
    }
}
