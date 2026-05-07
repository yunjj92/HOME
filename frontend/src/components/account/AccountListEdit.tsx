import { useState } from "react";
import { formatDateTime } from "../../util/formatDateTime";
import type { AccountData } from "../../api/zod/accountResponse.zod";

type AccountListProps = {
    accounts: AccountData[];
    bankMap: Map<number, string>;
    accountTypeCodeMap: Map<string, string>;
    currencyTypeCodeMap: Map<string, string>;
    setIsEditModeFalse:() => void;
};

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
                <option key="0">선택</option>
                {Array.from(map.entries()).map(([k, v]) => (
                    <option key={k} value={k}>
                        {v}
                    </option>
                ))}
            </select>
        </td>
    )
}


export function AccountListEdit({ accounts, bankMap, accountTypeCodeMap, currencyTypeCodeMap, setIsEditModeFalse }: AccountListProps) {
    
    const createEmptyRow = (): AccountRow => ({
        id: null,
        bankId: null,
        accountType: null,
        name: null,
        owner: null,
        currencyType: null,
        accountNumber: null,
        description: null,
        createdAt: null,
        createdBy: null,
        updatedAt: null,
        updatedBy: null,
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
        toDelete: false,
        })),
        createEmptyRow(),
    ]);

    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    const modifyRow = (
        target: number,
        field: keyof AccountRow,
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
                <ThisTdSelect value={row.bankId} onChange={(value) => modifyRow(index, "bankId", value)} map={bankMap} disabled={row.toDelete}/>
                <ThisTdSelect value={row.accountType} onChange={(value) => modifyRow(index, "accountType", value)} map={accountTypeCodeMap} disabled={row.toDelete}/>
                <ThisTdInput value={row.owner} onChange={(value) => modifyRow(index, "owner", value)} disabled={row.toDelete}/>
                <ThisTdSelect value={row.currencyType} onChange={(value) => modifyRow(index, "currencyType", value)} map={currencyTypeCodeMap} disabled={row.toDelete}/>
                <ThisTdInput value={row.accountNumber} onChange={(value) => modifyRow(index, "accountNumber", value)} disabled={row.toDelete}/>
                <ThisTdInput value={row.description} onChange={(value) => modifyRow(index, "description", value)} disabled={row.toDelete}/>
                <td className="px-4 py-3 text-center">{formatDateTime(row.createdAt ?? "-")}</td>
                <td className="px-4 py-3 text-center">{formatDateTime(row.updatedAt ?? "-")}</td>
                <td className="px-4 py-3 text-center">
                    {index === rows.length - 1 ? (
                        <button
                        type="button"
                        onClick={addRow}
                        className="rounded bg-gray-200 px-4 py-1"
                        >
                        ＋
                        </button>
                    ) : (
                        <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="rounded bg-gray-200 px-4 py-1"
                        >
                        －
                        </button>
                    )}
                </td>
            </tr>
        ))}
            <tr className="cm-tbody-tr">
                <td colSpan={10} className="cm-td">
                    <div className="flex items-center justify-end gap-1">
                        <button type="button" className="cm-button">
                            저장
                        </button>
                        <button type="button" className="cm-button" onClick={setIsEditModeFalse}>
                            취소
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    );
}