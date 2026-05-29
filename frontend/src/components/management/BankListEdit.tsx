import { useState } from "react";
import { formatDateTime } from "../../utils/formatDateTime";
import type { BankData } from "../../api/zod/bankResponse.zod";
import { useQueryClient } from "@tanstack/react-query";
import { resolveMutateResult } from "../../utils/resolveMutateResult";
import { getGetBanksQueryKey, useUpdateBanks } from "../../api/generated";
import { bankUpdateRequestSchema } from "../../api/zod/bankUpdateRequest.zod";
import z from "zod";

type BankListProps = {
    banks: BankData[];
    setIsEditModeFalse:() => void;
};

interface BankRow {
    id?: number;
    name?: string;
    createdAt?: string;
    updatedAt?: string | null;
    rowKey: string;
    toUpdate: boolean;
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

    const queryClient = useQueryClient();
    const { resolveMutateAsync } = resolveMutateResult(useUpdateBanks({
        mutation: {
            onSuccess: () => {
                alert(`저장되었습니다.`);
                void queryClient.invalidateQueries({ queryKey: getGetBanksQueryKey() });
                setIsEditModeFalse();
            },
        },
    }));
    
    const createEmptyRow = (): BankRow => ({
        rowKey: crypto.randomUUID(),
        toUpdate: false,
        toDelete: false,
    });
    
    const [rows, setRows] = useState<BankRow[]>([...banks.map((bank) => ({
        id: bank.id,
        name: bank.name,
        createdAt: bank.createdAt,
        updatedAt: bank.updatedAt,
        rowKey: `old-${bank.id}`,
        toUpdate: false,
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
            index === target ? { ...row, [field]: value, toUpdate: true } : row
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

    const saveRows = async () => {
        const saveRows = rows
            .filter((row) => row.toUpdate || row.toDelete)
            .map((row) => ({ ...row, requestedBy: "dev" }));
        
        if(saveRows.length === 0) return alert(`저장할 항목이 없습니다.`);
        if(!confirm(`총 ${saveRows.length}건의 데이터를 저장하시겠습니까?`)) return;

        await resolveMutateAsync({ data: saveRows }, z.array(z.union([
            bankUpdateRequestSchema.extend({
                id: z.number(),
                toDelete: z.literal(true),
            }),
            bankUpdateRequestSchema.extend({
                name: z.string().trim().min(1, "은행명이 입력되지 않았습니다."),
            }),
        ])));
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
                        <button type="button" className="cm-button" onClick={() => {void saveRows()}}>저장</button>
                        <button type="button" className="cm-button" onClick={setIsEditModeFalse}>취소</button>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}