import { useState } from "react";
import { formatDateTime } from "../../util/formatDateTime";
import type { AccountData } from "../../api/zod/accountResponse.zod";
import { accountUpdateRequestSchema } from "../../api/zod/accountUpdateRequest.zod";
import z from "zod";
import { getGetAccountsQueryKey, useUpdateAccounts } from "../../api/generated";
import { resolveMutateResult } from "../../util/resolveMutateResult";
import { useQueryClient } from "@tanstack/react-query";

type AccountListProps = {
    accounts: AccountData[];
    bankMap: Map<number, string>;
    accountTypeCodeMap: Map<string, string>;
    currencyTypeCodeMap: Map<string, string>;
    setIsEditModeFalse:() => void;
};

interface AccountRow {
    id?: number;
    bankId?: number;
    accountType?: string;
    name?: string;
    owner?: string;
    currencyType?: string;
    accountNumber?: string;
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

function ThisTdSelect({value, onChange, map, disabled=false}: {
    value: string | number | null | undefined;
    onChange: (value: string) => void;
    map: Map<string | number, string>;
    disabled: boolean;
}) {
    return (
        <td className="cm-td">
            <select 
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className="cm-select"
            >
                <option value="">선택</option>
                {Array.from(map.entries()).map(([k, v]) => (
                    <option key={k} value={k}>
                        {v}
                    </option>
                ))}
            </select>
        </td>
    )
};


export function AccountListEdit({ accounts, bankMap, accountTypeCodeMap, currencyTypeCodeMap, setIsEditModeFalse }: AccountListProps) {
    
    const queryClient = useQueryClient();
    const { resolveMutateAsync } = resolveMutateResult(useUpdateAccounts({
        mutation: {
            onSuccess: () => {
                alert(`저장되었습니다.`);
                queryClient.invalidateQueries({ queryKey: getGetAccountsQueryKey() });
                setIsEditModeFalse();
            },
        },
    }));

    const createEmptyRow = (): AccountRow => ({
        rowKey: crypto.randomUUID(),
        toUpdate: false,
        toDelete: false,
    });
    
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
        rowKey: `old-${account.id}`,
        toUpdate: false,
        toDelete: false,
        })),
        createEmptyRow(),
    ]);

    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    const modifyRow = <K extends keyof AccountRow>(
        target: number,
        field: K,
        value: AccountRow[K],
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
            .filter((row) => row.toUpdate || row.toDelete)
            .map((row) => ({ ...row, requestedBy: "dev" }));
        
        if(saveRows.length === 0) return alert(`저장할 항목이 없습니다.`);
        if(!confirm(`총 ${saveRows.length}건의 데이터를 저장하시겠습니까?`)) return;

        await resolveMutateAsync({ data: saveRows }, z.array(z.union([
            // 삭제일 경우
            accountUpdateRequestSchema.extend({
                id: z.number(),
                toDelete: z.literal(true),
            }),
            // 신규 또는 수정일 경우
            accountUpdateRequestSchema.extend({
                name: z.string().trim().min(1, "계좌명이 입력되지 않았습니다."),
                bankId: z.number().min(1, "은행명이 입력되지 않았습니다."),
                accountType: z.string().min(1, "계좌종류가 입력되지 않았습니다."),
                owner: z.string().trim().min(1, "소유주가 입력되지 않았습니다."),
                currencyType: z.string().min(1, "계좌통화가 입력되지 않았습니다."),
                accountNumber: z.string().trim().min(1, "계좌번호가 입력되지 않았습니다."),
            }),
        ])));
    };

    return (
        <tbody>
        {rows.map((row, index) => (
            <tr key={row.rowKey} className={!row.toDelete ? "cm-tbody-tr" : "cm-tbody-tr-delete"}>
                <ThisTdInput value={row.name} onChange={(value) => modifyRow(index, "name", value)} disabled={row.toDelete}/>
                <ThisTdSelect value={row.bankId} onChange={(value) => modifyRow(index, "bankId", Number(value))} map={bankMap} disabled={row.toDelete}/>
                <ThisTdSelect value={row.accountType} onChange={(value) => modifyRow(index, "accountType", value)} map={accountTypeCodeMap} disabled={row.toDelete}/>
                <ThisTdInput value={row.owner} onChange={(value) => modifyRow(index, "owner", value)} disabled={row.toDelete}/>
                <ThisTdSelect value={row.currencyType} onChange={(value) => modifyRow(index, "currencyType", value)} map={currencyTypeCodeMap} disabled={row.toDelete}/>
                <ThisTdInput value={row.accountNumber} onChange={(value) => modifyRow(index, "accountNumber", value)} disabled={row.toDelete}/>
                <ThisTdInput value={row.description} onChange={(value) => modifyRow(index, "description", value)} disabled={row.toDelete}/>
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
                        <button type="button" className="cm-button" onClick={saveRows}>저장</button>
                        <button type="button" className="cm-button" onClick={setIsEditModeFalse}>취소</button>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}