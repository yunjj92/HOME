import { formatDateTime } from "../../utils/formatDateTime";
import type { TypeData } from "../../api/zod/typeResponse.zod";

type TypeListProps = {
    types: TypeData[];
    selectedTypeId: number;
    onClickType:(typeId:number | undefined) => void;
};

export function TypeList({ types, selectedTypeId, onClickType }: TypeListProps) {
    return (
        <tbody>
            {types.length > 0 ? types.map((type) => (
                <tr key={type.id} className={type.id === selectedTypeId
                    ? "cm-tbody-tr bg-gray-100"
                    : "cm-tbody-tr"
                } onClick={() => onClickType(type.id)}>
                    <td className="cm-td">{type.name ?? "-"}</td>
                    <td className="cm-td">{type.description ?? "-"}</td>
                    <td className="cm-td">{formatDateTime(type.createdAt ?? "-")}</td>
                    <td className="cm-td">{formatDateTime(type.updatedAt ?? "-")}</td>
                </tr>
            )) : (
                <tr className="cm-tbody-tr">
                    <td colSpan={4} className="cm-td">데이터가 없습니다.</td>
                </tr>
            )}
        </tbody>
    );
}