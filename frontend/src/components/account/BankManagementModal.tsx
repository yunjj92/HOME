import { useEffect, useState } from "react";
import { bankRequestSchema } from "../../schemas/account/bankRequest";
import { getInitAccountManagementQueryKey, useUpdateBanks } from "../../api/generated";
import { useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { formatDateTime } from "../../util/formatDateTime";
import type { BankResult } from "../../api/zod/bankResult.zod";

type BankManagementModalProps = {
    bankList: BankResult[],
    onClose: () => void,
};

type BankRow = {
    id: number | null;
    name: string;
    createdAt: string | null;
    updatedAt: string | null;
    toDelete: boolean;
};

export function BankManagementModal({ bankList, onClose }: BankManagementModalProps) {

    // 은행 데이터 저장 hook 세팅
    const queryClient = useQueryClient();
    const updateBanksMutation = useUpdateBanks({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey: getInitAccountManagementQueryKey(),
                })
            },
            onError: () => {
                alert(`저장 중 오류가 발생했습니다.`);
            },
        }
    });

    const createEmptyRow = (): BankRow => ({
        id: null,
        name: "",
        createdAt: null,
        updatedAt: null,
        toDelete: false,
    });

    // 기존 은행 리스트 변환, 은행리스트 리로드마다 실행
    const [rows, setRows] = useState<BankRow[]>([]);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRows([
            ...bankList.map((bank) => ({
                id: bank.id ?? 0,
                name: bank.name ?? "",
                createdAt: bank.createdAt ?? "",
                updatedAt: bank.updatedAt ?? "",
                toDelete: false,
            })),
            createEmptyRow(),
        ]);
    }, [bankList]);

    // 행추가
    const addRow = () => {
        setRows((prev) => [...prev, createEmptyRow()]);
    };

    // 행수정
    const modifyRowName = (targetIndex: number, value: string) => {
        setRows((prev) =>
            prev.map((row, index) =>
                index === targetIndex
                    ? { ...row, name: value }
                    : row
            )
        );
    };
    
    // 행삭제
    const removeRow = (targetIndex: number) => {
        setRows((prev) => {
            if(prev[targetIndex].id === null) {
                return prev.filter((_, idx) => idx !== targetIndex);
            } else {
                return prev.map((row, idx) => idx === targetIndex ? { ...row, toDelete: true } : row);
            }
        }); 
    };
    
    // 저장
    const save = async () => {
        const requestData = rows.filter((row) => {
                if(row.id === null) return row.name?.length ?? 0 > 0;
                if(row.id !== null) {
                    if(row.toDelete) return true;
                    if(row.name.trim() !== banks.find((bank) => bank.id === row.id)?.name.trim()) return true;
                }
            }).map(row => ({
                id: row.id,
                name: row.name,
                requestedBy: "dev",
                toDelete: row.toDelete,
            })
        );

        const parsed = z.array(bankRequestSchema).safeParse(requestData);    

        if(!parsed.success) {
            alert(parsed.error.issues.map((issue) => issue.message));
            return;
        } else if(parsed.data.length === 0) {
            alert(`입력된 내용이 없습니다.`);
            return;
        }

        if(!confirm(`총 ${parsed.data.length}건의 데이터를 저장하시겠습니까?`)) return;

        await updateBanksMutation.mutateAsync({
                data: parsed.data,
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div
                className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between ">
                    <h2 className="text-lg font-bold">은행 관리</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100"
                    >
                        X
                    </button>
                </div>

                <div className="mb-4">
                    <table className="table-auto w-full border border-gray-300">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 text-center">은행명</th>
                            <th className="border px-2 py-1 text-center">등록일</th>
                            <th className="border px-2 py-1 text-center">최종수정일</th>
                            <th className="border px-2 py-1 text-center">추가/삭제</th>
                        </tr>
                        </thead>

                        <tbody>
                        {/* 기존 데이터 */}
                        {rows.map((row, index) => (
                            <tr 
                                key={row.id ?? `new-${index}`}
                                className={row.toDelete ? "bg-gray-100 opacity-50" : ""}
                            >
                                <td className="border px-2 py-1">
                                    <input 
                                        value={row.name} 
                                        onChange={(event) => {
                                            modifyRowName(index, event.target.value)
                                        }}
                                        placeholder="은행명을 입력하세요"
                                        className="w-full rounded border border-gray-300 px-2 py-1"
                                        disabled={row.toDelete}
                                    />
                                </td>
                                <td className="border px-2 py-1 text-center">{formatDateTime(row.createdAt)}</td>
                                <td className="border px-2 py-1 text-center">{formatDateTime(row.updatedAt)}</td>
                                <td className="border px-2 py-1 text-center">
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
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => { void save(); }}
                        className="rounded bg-gray-200 px-4 py-2"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}