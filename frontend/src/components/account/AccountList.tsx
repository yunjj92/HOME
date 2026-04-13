import { useEffect, useState } from "react";
import type { AccountResult } from "../../api/zod/accountResult.zod";
import type { BankResult } from "../../api/zod/bankResult.zod";


type AccountListProps = {
    accounts: AccountResult[];
    banks: BankResult[];
}

export function AccountList({ banks }: AccountListProps) {

    const [bankMap, setBankMap] = useState(new Map<string, string>());
    
    const addItem = (banks: BankResult) =>{
        useEffect(() => {
        const newMap = new Map(bankMap);
        newMap.set(banks.id?.toString() ?? '-', banks.name ?? '-');
        setBankMap(newMap);
        }, [banks]);
    }

    for(const bank of banks){
        addItem(bank);
    }


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