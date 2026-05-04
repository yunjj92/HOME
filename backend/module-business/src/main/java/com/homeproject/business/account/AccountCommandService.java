package com.homeproject.business.account;

import com.homeproject.business.account.dto.AccountParam;
import com.homeproject.business.account.dto.BankParam;
import com.homeproject.db.account.AccountsRepository;
import com.homeproject.db.account.dto.AccountCommand;
import com.homeproject.db.account.dto.BankCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountCommandService {
    private final AccountsRepository accountsRepository;

    private BankCommand toBankCommand(BankParam bankParam) {
        return new BankCommand(
                bankParam.id(),
                bankParam.name(),
                bankParam.requestedBy()
        );
    }

    private AccountCommand toAccountCommand(AccountParam accountParam) {
        return new AccountCommand(
                accountParam.id(),
                accountParam.bankId(),
                accountParam.accountType(),
                accountParam.name(),
                accountParam.owner(),
                accountParam.currencyType(),
                accountParam.accountNumber(),
                accountParam.description(),
                accountParam.requestedBy()
        );
    }

    @Transactional
    public void saveBanks(List<BankParam> bankParams) {
        for(BankParam bankParam : bankParams) {
            BankCommand bankCommand = toBankCommand(bankParam);

            if(bankParam.id() == null) {
                accountsRepository.insertBank(bankCommand);
            } else if(bankParam.toDelete()) {
                accountsRepository.deleteBank(bankCommand);
            } else {
                accountsRepository.updateBank(bankCommand);
            }
        }
    }

    @Transactional
    public void saveAccount(AccountParam accountParam) {
        AccountCommand accountCommand = toAccountCommand(accountParam);

        if(accountParam.id() == null) {
            accountsRepository.insertAccount(accountCommand);
        } else if(accountParam.toDelete()) {
            accountsRepository.deleteAccount(accountCommand);
        } else {
            accountsRepository.updateAccount(accountCommand);
        }
    }
}
