import type { MinistryData } from "../../api/zod/ministryResponse.zod";
import { formatDateTime } from "../../util/formatDateTime";

type MinistryListProps = {
    ministries: MinistryData[];
};

export function MinistryList({ ministries }: MinistryListProps) {
    return (
        <tbody>
            {ministries.length > 0 ? ministries.map((ministry) => (
                <tr key={ministry.id} className="cm-tbody-tr">
                    <td className="cm-td">{ministry.name ?? "-"}</td>
                    <td className="cm-td text-left">{ministry.description ?? "-"}</td>
                    <td className="cm-td">{formatDateTime(ministry.createdAt ?? "-")}</td>
                    <td className="cm-td">{formatDateTime(ministry.updatedAt ?? "-")}</td>
                </tr>
            )) : (
                <tr className="cm-tbody-tr">
                    <td colSpan={4} className="cm-td">데이터가 없습니다.</td>
                </tr>
            )}
        </tbody>
    );
}