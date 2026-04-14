import { useMemo } from "react";
import type { AccountResult } from "../../api/zod/accountResult.zod";
import type { BankResult } from "../../api/zod/bankResult.zod";


type AccountListProps = {
    accounts: AccountResult[];
    banks: BankResult[];
}

export function AccountList({ banks }: AccountListProps) {

const bankMap = useMemo(() => {
    const map = new Map();
    for (const bank of banks) {
        map.set(bank.id?.toString() ?? '-', bank.name ?? '-');
    }
    return map;
}, [banks]);

    return (
        <div>
            <ul>
                {Array.from(bankMap.entries()).map(([bankId, bankName]) => (
                    <li key={bankId}>
                        {bankName} (ID: {bankId})
                    </li>
                ))}
            </ul>
        </div>
    );
}