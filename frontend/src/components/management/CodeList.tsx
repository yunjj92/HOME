import { formatDateTime } from "../../utils/formatDateTime";
import type { CodeData } from "../../api/zod/codeResponse.zod";

type CodeListProps = {
    codes: CodeData[];
};

export function CodeList({ codes }: CodeListProps) {
    return (
        <tbody>
            {codes.length > 0 ? codes.map((code) => (
                <tr key={code.id} className="cm-tbody-tr">
                    <td className="cm-td">{code.code ?? "-"}</td>
                    <td className="cm-td">{code.name ?? "-"}</td>
                    <td className="cm-td">{code.description ?? "-"}</td>
                    <td className="cm-td">{formatDateTime(code.createdAt ?? "-")}</td>
                    <td className="cm-td">{formatDateTime(code.updatedAt ?? "-")}</td>
                </tr>
            )) : (
                <tr className="cm-tbody-tr">
                    <td colSpan={5} className="cm-td">데이터가 없습니다.</td>
                </tr>
            )}
        </tbody>
    );
}