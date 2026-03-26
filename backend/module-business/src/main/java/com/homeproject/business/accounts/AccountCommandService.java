package com.homeproject.business.accounts;

import com.homeproject.business.accounts.dto.AccountRequest;
import com.homeproject.business.accounts.dto.BankRequest;
import com.homeproject.db.accounts.AccountsRepository;
import com.homeproject.db.accounts.dto.AccountCommand;
import com.homeproject.db.accounts.dto.BankCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountCommandService {
    private final AccountsRepository accountsRepository;

    private BankCommand toBankCommand(BankRequest bankRequest) {
        return new BankCommand(
                bankRequest.id(),
                bankRequest.name(),
                bankRequest.requestedBy()
        );
    }

    private AccountCommand toAccountCommand(AccountRequest accountRequest) {
        return new AccountCommand(
                accountRequest.id(),
                accountRequest.bankId(),
                accountRequest.accountType(),
                accountRequest.name(),
                accountRequest.owner(),
                accountRequest.currencyType(),
                accountRequest.accountNumber(),
                accountRequest.description(),
                accountRequest.requestedBy()
        );
    }

    @Transactional
    public void saveBank(BankRequest bankRequest) {
        BankCommand bankCommand = toBankCommand(bankRequest);

        if(bankRequest.id() == null) {
            accountsRepository.insertBank(bankCommand);
        } else if(bankRequest.toDelete()) {
            accountsRepository.deleteBank(bankCommand);
        } else {
            accountsRepository.updateBank(bankCommand);
        }
    }

    @Transactional
    public void saveAccount(AccountRequest accountRequest) {
        AccountCommand accountCommand = toAccountCommand(accountRequest);

        if(accountRequest.id() == null) {
            accountsRepository.insertAccount(accountCommand);
        } else if(accountRequest.toDelete()) {
            accountsRepository.deleteAccount(accountCommand);
        } else {
            accountsRepository.updateAccount(accountCommand);
        }
    }
}
