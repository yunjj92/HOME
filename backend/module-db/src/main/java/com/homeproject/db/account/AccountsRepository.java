package com.homeproject.db.account;

import com.homeproject.db.account.dto.AccountCommand;
import com.homeproject.db.account.dto.AccountProjection;
import com.homeproject.db.account.dto.BankCommand;
import com.homeproject.db.account.dto.BankProjection;

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
