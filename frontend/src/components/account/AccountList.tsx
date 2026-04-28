import { useMemo } from "react";
import type { AccountResult } from "../../api/zod/accountResult.zod";
import type { BankResult } from "../../api/zod/bankResult.zod";
import { formatDateTime } from "../../util/formatDateTime";


type AccountListProps = {
    accounts: AccountResult[];
    banks: BankResult[];
};



export function AccountList({ accounts, banks }: AccountListProps) {

    const bankMap = useMemo(() => {
        return new Map(banks.map((bank) => [bank.id, bank.name]));
    }, [banks]);

    const getBankName = (bankId: number | null) => {
        if (bankId == null) return "-";
        return bankMap.get(bankId) ?? "-";
    };


    if(accounts.length == 0) console.log("accounts 0")

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-600">계좌명</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">은행명</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">계좌타입</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">소유주</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">계좌통화</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">계좌번호</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">설명</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">생성일</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">최종수정일</th>
                </tr>
                </thead>

                <tbody>
                {accounts.map((account) => (
                    <tr
                    key={account.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                    <td className="px-4 py-3">{account.name ?? "-"}</td>
                    <td className="px-4 py-3">{getBankName(account.bankId ?? 0)}</td>
                    <td className="px-4 py-3">{account.accountType ?? "-"}</td>
                    <td className="px-4 py-3">{account.owner ?? "-"}</td>
                    <td className="px-4 py-3">{account.currencyType ?? "-"}</td>
                    <td className="px-4 py-3">{account.accountNumber ?? "-"}</td>
                    <td className="px-4 py-3">{account.description ?? "-"}</td>
                    <td className="px-4 py-3">{formatDateTime(account.createdAt ?? "-")}</td>
                    <td className="px-4 py-3">{formatDateTime(account.updatedAt ?? "-")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
            
    );
}