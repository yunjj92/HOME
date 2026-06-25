package com.homeproject.db.entry;

import com.homeproject.db.entry.dto.*;

public interface EntriesRepository {
    Integer insertEntry(EntryCommand entryCommand);
    Integer insertIncome(IncomeCommand incomeCommand);
    Integer insertExpense(ExpenseCommand expenseCommand);
}
