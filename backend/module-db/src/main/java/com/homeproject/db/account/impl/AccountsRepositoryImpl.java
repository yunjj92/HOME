package com.homeproject.db.account.impl;

import com.homeproject.db.account.dto.BankProjection;
import com.homeproject.db.jooq.tables.records.AccountsRecord;
import com.homeproject.db.jooq.tables.records.BanksRecord;
import com.homeproject.db.account.AccountsRepository;
import com.homeproject.db.account.dto.AccountCommand;
import com.homeproject.db.account.dto.AccountProjection;
import com.homeproject.db.account.dto.BankCommand;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.homeproject.db.jooq.tables.VAccounts.V_ACCOUNTS;
import static com.homeproject.db.jooq.Tables.ACCOUNTS;
import static com.homeproject.db.jooq.tables.VBanks.V_BANKS;
import static com.homeproject.db.jooq.Tables.BANKS;
import static org.jooq.impl.DSL.currentOffsetDateTime;

@Repository
@RequiredArgsConstructor
public class AccountsRepositoryImpl implements AccountsRepository {

    private final DSLContext dsl;

    @Override
    public List<AccountProjection> getAccountList() {
        return dsl
                .selectFrom(V_ACCOUNTS)
                .fetchInto(AccountProjection.class);
    }

    @Override
    public List<BankProjection> getBankList() {
        return dsl
                .selectFrom(V_BANKS)
                .fetchInto(BankProjection.class);
    }

    @Override
    public Integer insertAccount(AccountCommand accountCommand) {
        AccountsRecord accountsRecord = dsl.insertInto(ACCOUNTS)
                .set(ACCOUNTS.BANK_ID, accountCommand.bankId())
                .set(ACCOUNTS.ACCOUNT_TYPE, accountCommand.accountType())
                .set(ACCOUNTS.NAME, accountCommand.name())
                .set(ACCOUNTS.OWNER, accountCommand.owner())
                .set(ACCOUNTS.CURRENCY_TYPE, accountCommand.currencyType())
                .set(ACCOUNTS.ACCOUNT_NUMBER, accountCommand.accountNumber())
                .set(ACCOUNTS.DESCRIPTION, accountCommand.description())
                .set(ACCOUNTS.CREATED_BY, accountCommand.requestedBy())
                .returning(ACCOUNTS.ID)
                .fetchOne();

        if(accountsRecord == null) throw new IllegalStateException("Account insert failed");

        return accountsRecord.getId();
    }

    @Override
    public void updateAccount(AccountCommand accountCommand) {
        dsl.update(ACCOUNTS)
                .set(ACCOUNTS.BANK_ID, accountCommand.bankId())
                .set(ACCOUNTS.ACCOUNT_TYPE, accountCommand.accountType())
                .set(ACCOUNTS.NAME, accountCommand.name())
                .set(ACCOUNTS.OWNER, accountCommand.owner())
                .set(ACCOUNTS.CURRENCY_TYPE, accountCommand.currencyType())
                .set(ACCOUNTS.ACCOUNT_NUMBER, accountCommand.accountNumber())
                .set(ACCOUNTS.DESCRIPTION, accountCommand.description())
                .set(ACCOUNTS.UPDATED_AT, currentOffsetDateTime())
                .set(ACCOUNTS.UPDATED_BY, accountCommand.requestedBy())
                .where(ACCOUNTS.ID.eq(accountCommand.id()))
                .execute();
    }

    @Override
    public void deleteAccount(AccountCommand accountCommand) {
        dsl.update(ACCOUNTS)
                .set(ACCOUNTS.DELETED_AT, currentOffsetDateTime())
                .set(ACCOUNTS.DELETED_BY, accountCommand.requestedBy())
                .where(ACCOUNTS.ID.eq(accountCommand.id()))
                .execute();
    }

    @Override
    public Integer insertBank(BankCommand bankCommand) {
        BanksRecord banksRecord = dsl.insertInto(BANKS)
                .set(BANKS.NAME, bankCommand.name())
                .set(BANKS.CREATED_BY, bankCommand.requestedBy())
                .returning(BANKS.ID)
                .fetchOne();

        if(banksRecord == null) throw new IllegalStateException("Bank insert failed");

        return banksRecord.getId();
    }

    @Override
    public void updateBank(BankCommand bankCommand) {
        dsl.update(BANKS)
                .set(BANKS.NAME, bankCommand.name())
                .set(BANKS.UPDATED_AT, currentOffsetDateTime())
                .set(BANKS.UPDATED_BY, bankCommand.requestedBy())
                .where(BANKS.ID.eq(bankCommand.id()))
                .execute();
    }

    @Override
    public void deleteBank(BankCommand bankCommand) {
        dsl.update(BANKS)
                .set(BANKS.DELETED_AT, currentOffsetDateTime())
                .set(BANKS.DELETED_BY, bankCommand.requestedBy())
                .where(BANKS.ID.eq(bankCommand.id()))
                .execute();
    }
}
