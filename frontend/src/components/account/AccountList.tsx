import type { Account } from "../../schemas/account/account";

type AccountListProps = {
    accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
    return (
        <div>
            <ul>
                {accounts.map((account) => (
                    <li key={account.id}>
                        {account.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}