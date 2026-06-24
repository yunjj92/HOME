package com.homeproject.db.entry.impl;

import com.homeproject.db.entry.EntriesRepository;
import com.homeproject.db.entry.dto.*;
import com.homeproject.db.jooq.tables.records.*;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.ZoneId;

import static com.homeproject.db.jooq.Tables.ENTRIES;
import static com.homeproject.db.jooq.Tables.INCOMES;
import static com.homeproject.db.jooq.Tables.EXPENSES;

@Repository
@RequiredArgsConstructor
public class EntriesRepositoryImpl implements EntriesRepository {

    private final DSLContext dsl;



    @Override
    public Integer insertEntry(EntryCommand entryCommand) {
        EntriesRecord entriesRecord = dsl.insertInto(ENTRIES)
                .set(ENTRIES.ACCOUNT_ID, entryCommand.accountId())
                .set(ENTRIES.DATE, entryCommand.date().atStartOfDay(ZoneId.of("Asia/Seoul")).toOffsetDateTime())
                .set(ENTRIES.AMOUNT, entryCommand.amount())
                .set(ENTRIES.MEMO, entryCommand.memo())
                .set(ENTRIES.CREATED_BY, entryCommand.requestedBy())
                .returning(ENTRIES.ID)
                .fetchOne();

        if(entriesRecord == null) throw new IllegalStateException("Entry insert failed");

        return entriesRecord.getId();
    }

    @Override
    public Integer insertIncome(IncomeCommand incomeCommand) {
        IncomesRecord incomesRecord = dsl.insertInto(INCOMES)
                .set(INCOMES.ENTRY_ID, incomeCommand.entryId())
                .set(INCOMES.SOURCE_ID, incomeCommand.sourceId())
                .set(INCOMES.CREATED_BY, incomeCommand.requestedBy())
                .returning(INCOMES.ENTRY_ID)
                .fetchOne();

        if(incomesRecord == null) throw new IllegalStateException("Income insert failed");

        return incomesRecord.getEntryId();
    }

    @Override
    public Integer insertExpense(ExpenseCommand expenseCommand) {
        ExpensesRecord expensesRecord = dsl.insertInto(EXPENSES)
                .set(EXPENSES.ENTRY_ID, expenseCommand.entryId())
                .set(EXPENSES.MERCHANT, expenseCommand.merchant())
                .set(EXPENSES.MINISTRY_ID, expenseCommand.ministryId())
                .set(EXPENSES.TAG_ID, expenseCommand.tagId())
                .set(EXPENSES.CREATED_BY, expenseCommand.requestedBy())
                .returning(EXPENSES.ENTRY_ID)
                .fetchOne();

        if(expensesRecord == null) throw new IllegalStateException("Expense insert failed");

        return expensesRecord.getEntryId();
    }
}
