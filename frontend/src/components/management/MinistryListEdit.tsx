import { useQueryClient } from "@tanstack/react-query";
import type { MinistryData } from "../../api/zod/ministryResponse.zod";
import { resolveMutateResult } from "../../utils/resolveMutateResult";
import { getGetMinistriesQueryKey, useUpdateMinistries } from "../../api/generated";
import { useState } from "react";
import z from "zod";
import { ministryUpdateRequestSchema } from "../../api/zod/ministryUpdateRequest.zod";
import { formatDateTime } from "../../utils/formatDateTime";

type MinistryListProps = {
    ministries: MinistryData[];
    setIsEditModeFalse:() => void;
};

interface MinistryRow {
    id?: number;
    name?: string;
    description?: string;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
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

export function MinistryListEdit({ ministries, setIsEditModeFalse }: MinistryListProps) {
    
    const queryClient = useQueryClient();
    const { resolveMutateAsync } = resolveMutateResult(useUpdateMinistries({
        mutation: {
            onSuccess: () => {
                alert(`저장되었습니다.`);
                void queryClient.invalidateQueries({ queryKey: getGetMinistriesQueryKey() });
                setIsEditModeFalse();
            },
        },
    }));

    const createEmptyRow = (): MinistryRow => ({
        rowKey: crypto.randomUUID(),
        toUpdate: false,
        toDelete: false,
    });
    
    const [rows, setRows] = useState<MinistryRow[]>([...ministries.map((ministry) => ({
        id: ministry.id, 
        name: ministry.name,
        description: ministry.description,
        createdAt: ministry.createdAt,
        createdBy: ministry.createdBy,
        updatedAt: ministry.updatedAt,
        updatedBy: ministry.updatedBy,
        rowKey: `old-${ministry.id}`,
        toUpdate: false,
        toDelete: false,
        })),
        createEmptyRow(),
    ]);

    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    const modifyRow = <K extends keyof MinistryRow>(
        target: number,
        field: K,
        value: MinistryRow[K],
    ) => {
        setRows((prev) => prev.map((row, index) => 
            index === target ? { ...row, [field]: value, toUpdate: true } : row
        ));
    };

    const removeRow = (targetIndex: number) => {
        setRows((prev) => {
            if(prev[targetIndex].id == null) {
                return prev.filter((_, idx) => idx !== targetIndex);
            } else {
                return prev.map((row, idx) => idx === targetIndex ? { ...row, toDelete: true } : row);
            }
        }); 
    };

    const saveRows = async () => {
        const saveRows = rows
            .filter((row) => row.toUpdate || row.toDelete);
        
        if(saveRows.length === 0) return alert(`저장할 항목이 없습니다.`);
        if(!confirm(`총 ${saveRows.length}건의 데이터를 저장하시겠습니까?`)) return;

        await resolveMutateAsync({ data: saveRows }, z.array(z.union([
            // 삭제일 경우
            ministryUpdateRequestSchema.extend({
                id: z.number(),
                toDelete: z.literal(true),
            }),
            // 신규 또는 수정일 경우
            ministryUpdateRequestSchema.extend({
                name: z.string().trim().min(1, "부처명이 입력되지 않았습니다."),
            }),
        ])));
    };

    return (
        <tbody>
        {rows.map((row, index) => (
            <tr key={row.rowKey} className={!row.toDelete ? "cm-tbody-tr" : "cm-tbody-tr-delete"}>
                <ThisTdInput value={row.name} onChange={(value) => modifyRow(index, "name", value)} disabled={row.toDelete}/>
                <ThisTdInput value={row.description} onChange={(value) => modifyRow(index, "description", value)} disabled={row.toDelete}/>
                <td className="cm-td">{formatDateTime(row.createdAt ?? "-")}</td>
                <td className="cm-td">{formatDateTime(row.updatedAt ?? "-")}</td>
                <td className="cm-td w-32">
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