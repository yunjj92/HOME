import type { Account } from "../../schemas/account/account";
import type { Bank } from "../../schemas/account/bank";

type AccountListProps = {
    accounts: Account[];
    banks: Bank[];
}

export function AccountList({ accounts, banks }: AccountListProps) {
    const bankMap = new Map<number, string>(
        banks.map((bank) => [bank.id, bank.name])
    );

    const getBankName = (bankId: number | null) => {
        if(bankId == null) return "-";
        return bankMap.get(bankId) ?? "-";
    }

    return (
        <div>
            <ul>
                {accounts.map((account) => (
                    <li key={account.id}>
                        {account.name} / {getBankName(account.bankId)}
                    </li>
                ))}
            </ul>
        </div>
    );
}