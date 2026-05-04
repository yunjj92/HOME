package com.homeproject.business.account;

import com.homeproject.business.account.dto.AccountResult;
import com.homeproject.business.account.dto.BankResult;
import com.homeproject.db.account.AccountsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class AccountQueryService {

    private final AccountsRepository accountsRepository;

    public List<AccountResult> getAccountList() {
        return accountsRepository.getAccountList()
                .stream()
                .map(AccountResult::from)
                .toList();
    }

    public List<BankResult> getBankList() {
        return accountsRepository.getBankList()
                .stream()
                .map(BankResult::from)
                .toList();
    }
}
