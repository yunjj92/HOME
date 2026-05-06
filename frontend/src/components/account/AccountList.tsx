import { formatDateTime } from "../../util/formatDateTime";
import type { AccountData } from "../../api/zod/accountResponse.zod";
import { getMappingData } from "../../util/getMappingData";

export type AccountListProps = {
    accounts: AccountData[];
    bankMap: Map<number, string>;
    accountTypeCodeMap: Map<string, string>;
    currencyTypeCodeMap: Map<string, string>;
};

export function AccountList({ accounts, bankMap, accountTypeCodeMap, currencyTypeCodeMap }: AccountListProps) {
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
                {accounts.length > 0 ? accounts.map((account) => (
                    <tr
                    key={account.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                        <td className="px-4 py-3 text-center">{account.name ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{getMappingData(bankMap, account.bankId)}</td>
                        <td className="px-4 py-3 text-center">{getMappingData(accountTypeCodeMap, account.accountType)}</td>
                        <td className="px-4 py-3 text-center">{account.owner ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{getMappingData(currencyTypeCodeMap, account.currencyType)}</td>
                        <td className="px-4 py-3 text-center">{account.accountNumber ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{account.description ?? "-"}</td>
                        <td className="px-4 py-3 text-center">{formatDateTime(account.createdAt ?? "-")}</td>
                        <td className="px-4 py-3 text-center">{formatDateTime(account.updatedAt ?? "-")}</td>
                    </tr>
                )) : (
                    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                        <td colSpan={9} className="px-4 py-3 text-center">데이터가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}