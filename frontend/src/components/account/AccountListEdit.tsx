import { useState } from "react";
import { formatDateTime } from "../../util/formatDateTime";
import { getMappingData } from "../../util/getMappingData";
import type { AccountListProps } from "./AccountList";

interface AccountRow {
    id: number | null | undefined;
    bankId: number | null | undefined;
    accountType: string | null | undefined;
    name: string | null | undefined;
    owner: string | null | undefined;
    currencyType: string | null | undefined;
    accountNumber: string | null | undefined;
    description: string | null | undefined;
    createdAt: string | null | undefined;
    createdBy: string | null | undefined;
    updatedAt: string | null | undefined;
    updatedBy: string | null | undefined;
    toDelete: boolean;
};

export function AccountListEdit({ accounts, bankMap, accountTypeCodeMap, currencyTypeCodeMap }: AccountListProps) {
    const [rows, setRows] = useState<AccountRow[]>([...accounts.map((account) => ({
        id: account.id, 
        bankId: account.bankId,
        accountType: account.accountType,
        name: account.name,
        owner: account.owner,
        currencyType: account.currencyType,
        accountNumber: account.accountNumber,
        description: account.description,
        createdAt: account.createdAt,
        createdBy: account.createdBy,
        updatedAt: account.updatedAt,
        updatedBy: account.updatedBy,
        toDelete: false,
    }))]);

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">은행명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌타입</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">소유주</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌통화</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌번호</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">설명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">생성일</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">최종수정일</th>
                    </tr>
                </thead>
                <tbody>
                {rows.map((row) => (
                    <tr
                    key={row.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                        <td className="px-4 py-3 text-center">
                            <input
                                value={row.name ?? ""} 
                                placeholder="계좌명을 입력하세요"
                                className="w-full rounded border border-gray-300 px-2 py-1"
                                disabled={row.toDelete}></input>
                        </td>
                        <td className="px-4 py-3 text-center">{getMappingData(bankMap, row.bankId)}</td>
                        <td className="px-4 py-3 text-center">{getMappingData(accountTypeCodeMap, row.accountType)}</td>
                        <td className="px-4 py-3 text-center">{row.owner ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{getMappingData(currencyTypeCodeMap, row.currencyType)}</td>
                        <td className="px-4 py-3 text-center">{row.accountNumber ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{row.description ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{formatDateTime(row.createdAt ?? "-")}</td>
                        <td className="px-4 py-3 text-center">{formatDateTime(row.updatedAt ?? "-")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}