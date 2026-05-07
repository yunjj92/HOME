import type { BankData } from "../../api/zod/bankResponse.zod"
import { formatDateTime } from "../../util/formatDateTime";

type BankListProps = {
    banks: BankData[];
};

export function BankList({ banks } : BankListProps) {
    return (
        <tbody>
            {banks.length > 0 ? banks.map((bank) => (
                <tr key={bank.id} className="cm-tbody-tr">
                    <td className="cm-td">{bank.name}</td>
                    <td className="cm-td">{formatDateTime(bank.createdAt ?? "-")}</td>
                    <td className="cm-td">{formatDateTime(bank.updatedAt ?? "-")}</td>
                </tr>
            )) : (
                <tr className="cm-tbody-tr">
                    <td colSpan={3} className="cm-td">데이터가 없습니다.</td>
                </tr>
            )}
        </tbody>
    )
}