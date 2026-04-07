package com.homeproject.db.accounts;

import com.homeproject.db.accounts.dto.AccountCommand;
import com.homeproject.db.accounts.dto.AccountProjection;
import com.homeproject.db.accounts.dto.BankCommand;
import com.homeproject.db.accounts.dto.BankProjection;

import java.util.List;

public interface AccountsRepository {
    List<AccountProjection> getAccountList();
    List<BankProjection> getBankList();
    Integer insertAccount(AccountCommand accountCommand);
    void updateAccount(AccountCommand accountCommand);
    void deleteAccount(AccountCommand accountCommand);
    Integer insertBank(BankCommand bankCommand);
    void updateBank(BankCommand bankCommand);
    void deleteBank(BankCommand bankCommand);
}
