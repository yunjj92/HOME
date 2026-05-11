import { useState } from "react";
import { formatDateTime } from "../../util/formatDateTime";
import type { BankData } from "../../api/zod/bankResponse.zod";

type BankListProps = {
    banks: BankData[];
    setIsEditModeFalse:() => void;
};

interface BankRow {
    id: number | null;
    name: string;
    createdAt: string | null;
    updatedAt: string | null;
    toDelete: boolean;
};

function ThisTdInput({value, onChange, disabled=false}: {
    value: string | null | undefined;
    onChange: (value: string) => void;
    disabled: boolean;
}) {
    return (
    <td className="cm-td">
        <input
            value={value ?? ""} 
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            placeholder="Empty"
            className="cm-input"
        ></input>
    </td>
    )
};

export function BankListEdit({ banks, setIsEditModeFalse }: BankListProps) {
    
    const createEmptyRow = (): BankRow => ({
        id: null,
        name: "",
        createdAt: null,
        updatedAt: null,
        toDelete: false,
    });
    
    const [rows, setRows] = useState<BankRow[]>([...banks.map((bank) => ({
        id: bank.id ?? 0,
        name: bank.name ?? "",
        createdAt: bank.createdAt ?? "",
        updatedAt: bank.updatedAt ?? "",
        toDelete: false,
        })),
        createEmptyRow(),
    ]);

    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    const modifyRow = (
        target: number,
        field: keyof BankRow,
        value: number | string,
    ) => {
        setRows((prev) => prev.map((row, index) => 
            index === target ? { ...row, [field]: value } : row
        ));
    };

    const removeRow = (targetIndex: number) => {
        setRows((prev) => {
            if(prev[targetIndex].id === null) {
                return prev.filter((_, idx) => idx !== targetIndex);
            } else {
                return prev.map((row, idx) => idx === targetIndex ? { ...row, toDelete: true } : row);
            }
        }); 
    };

    return (
        <tbody>
        {rows.map((row, index) => (
            <tr key={row.id} className={!row.toDelete ? "cm-tbody-tr" : "cm-tbody-tr-delete"}>
                <ThisTdInput value={row.name} onChange={(value) => modifyRow(index, "name", value)} disabled={row.toDelete}/>
                <td className="cm-td">{formatDateTime(row.createdAt ?? "-")}</td>
                <td className="cm-td">{formatDateTime(row.updatedAt ?? "-")}</td>
                <td className="cm-td">
                    {index === rows.length - 1 ? (
                        <button type="button" className="cm-table-button" onClick={addRow}>＋</button>
                    ) : (
                        <button type="button" className="cm-table-button" onClick={() => removeRow(index)}>－</button>
                    )}
                </td>
            </tr>
        ))}
            <tr className="cm-tbody-tr">
                <td colSpan={10} className="cm-td">
                    <div className="flex items-center justify-end gap-1">
                        <button type="button" className="cm-button">저장</button>
                        <button type="button" className="cm-button" onClick={setIsEditModeFalse}>취소</button>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}