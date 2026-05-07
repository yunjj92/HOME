import { formatDateTime } from "../../util/formatDateTime";
import type { AccountData } from "../../api/zod/accountResponse.zod";
import { getMappingData } from "../../util/getMappingData";

type AccountListProps = {
    accounts: AccountData[];
    bankMap: Map<number, string>;
    accountTypeCodeMap: Map<string, string>;
    currencyTypeCodeMap: Map<string, string>;
};

export function AccountList({ accounts, bankMap, accountTypeCodeMap, currencyTypeCodeMap }: AccountListProps) {
    return (
        <tbody>
        {accounts.length > 0 ? accounts.map((account) => (
            <tr
                key={account.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
                <td className="cm-td">{account.name ?? "-"}</td>
                <td className="cm-td">{getMappingData(bankMap, account.bankId)}</td>
                <td className="cm-td">{getMappingData(accountTypeCodeMap, account.accountType)}</td>
                <td className="cm-td">{account.owner ?? "-"}</td>
                <td className="cm-td">{getMappingData(currencyTypeCodeMap, account.currencyType)}</td>
                <td className="cm-td">{account.accountNumber ?? "-"}</td>
                <td className="cm-td">{account.description ?? "-"}</td>
                <td className="cm-td">{formatDateTime(account.createdAt ?? "-")}</td>
                <td className="cm-td">{formatDateTime(account.updatedAt ?? "-")}</td>
            </tr>
        )) : (
            <tr className="cm-tbody-tr">
                <td colSpan={9} className="cm-td">데이터가 없습니다.</td>
            </tr>
        )}
        </tbody>
    );
}