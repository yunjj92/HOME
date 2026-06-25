import { useCallback, useEffect, useMemo, useState } from "react";
import type { CellValueChangedEvent, ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";
import { useGetAccounts, useGetCodes, useGetMinistries, useGetThesauruses, useUpdateEntries } from "../../api/generated";
import { COMMON_QUERY_CONFIG } from "../../constants/queryConfig";
import { createErrorHandler } from "../../utils/errorHandler";
import { parseToZodSchema } from "../../utils/parseToZodSchema";
import z from "zod";
import { accountDataSchema } from "../../api/zod/accountResponse.zod";
import { ministryDataSchema } from "../../api/zod/ministryResponse.zod";
import { codeDataSchema } from "../../api/zod/codeResponse.zod";
import { useCodesMapping } from "../../hooks/common/useCodesMapping";
import { useListMapping } from "../../hooks/common/useListMapping";
import { thesaurusDataSchema } from "../../api/zod/thesaurusResponse.zod";
import { entryUpdateRequestSchema } from "../../api/zod/entryUpdateRequest.zod";
import { resolveMutateResult } from "../../utils/resolveMutateResult";

type Entry = {
    rowKey: string;
    accountId?: number;
    date?: string;
    amount?: number;
    memo?: string;
    connection?: string;
    ministryId?: number;
    tagName?: string;
    entryType?: string;
    toSave: boolean;
};

const createEmptyRow = (): Entry => ({
    rowKey: crypto.randomUUID(),
    toSave: false,
});

export const FinanceDataInsertView = () => {
    const {
        isLoading: isEntryTypesLoading,
        error: entryTypeCodesError,
        data: entryTypeCodesData,
    } = useGetCodes({ typeId: 4}, COMMON_QUERY_CONFIG);

    const {
        isLoading: isAccountsLoading,
        error: accountsError,
        data: accountsData,
    } = useGetAccounts(COMMON_QUERY_CONFIG);

    const {
        isLoading: isMinistriesLoading,
        error: ministriesError,
        data: ministriesData,
    } = useGetMinistries(COMMON_QUERY_CONFIG);

    const {
        isLoading: isThesaurusesLoading,
        error: thesaurusesError,
        data: thesaurusesData,
    } = useGetThesauruses(COMMON_QUERY_CONFIG);

    const isLoading = isEntryTypesLoading || isAccountsLoading || isMinistriesLoading || isThesaurusesLoading;

    useEffect(() => {
        if (isLoading) return;
        
        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: entryTypeCodesError, data: entryTypeCodesData }, { source: "entries" });
        errorHandler.collectResult({ error: accountsError, data: accountsData }, { source: "accounts" });
        errorHandler.collectResult({ error: ministriesError, data: ministriesData }, { source: "ministries" });
        errorHandler.collectResult({ error: thesaurusesError, data: thesaurusesData }, { source: "thesauruses" });
        errorHandler.flush();
    }, [
        isLoading,
        entryTypeCodesError,
        entryTypeCodesData,
        accountsError,
        accountsData,
        ministriesError,
        ministriesData, 
        thesaurusesError, 
        thesaurusesData,
    ]);

    const entryTypeCodes = parseToZodSchema(entryTypeCodesData?.data, z.array(codeDataSchema), []);
    const accounts = parseToZodSchema(accountsData?.data, z.array(accountDataSchema), []);
    const ministries = parseToZodSchema(ministriesData?.data, z.array(ministryDataSchema), []);
    const thesauruses = parseToZodSchema(thesaurusesData?.data, z.array(thesaurusDataSchema), []);

    const entryTypeCodeMap = useCodesMapping(entryTypeCodes);
    const accountMap = useListMapping(accounts, "id", "name");
    const ministryMap = useListMapping(ministries, "id", "name");

    const [rows, setRows] = useState<Entry[]>([
        createEmptyRow(),
    ]);

    const { resolveMutateAsync } = resolveMutateResult(useUpdateEntries({
        mutation: {
            onSuccess: () => {
                alert(`저장되었습니다.`);
                setRows(() => [ createEmptyRow(), ]);
            },
        },
    }));

    // 시소러스 적용 함수
    const applyThesaurus = (entry: Entry): Entry => {
        if(entry.entryType !== "exp" || !entry.accountId || !entry.connection) return entry;
        
        const matchedThesauruses = thesauruses.find((thesaurus) => 
            thesaurus.accountId === entry.accountId && 
            thesaurus.merchant?.trim() === entry.connection?.trim());
        if(!matchedThesauruses) return entry;
        return {
            ...entry,
            ministryId: matchedThesauruses.ministryId,
            tagName: matchedThesauruses.tagName ?? undefined,
        };
    };

    const modifyRow = (params: CellValueChangedEvent<Entry>) => {
        if(!params.data) return;

        setRows((prev) => {
            // 시소러스 적용여부 확인
            const shouldApplyThesaurus = ["entryType", "accountId", "connection"].includes(params.column.getColId());
            
            // toSave적용 및 수입선택시 데이터 삭제 및 시소러스 적용
            const nextRows = prev.map((row) => {
                if(row.rowKey !== params.data?.rowKey) return row;
                const isInc = params.column.getColId() === "entryType" && row.entryType === "inc";
                const toSaveRow = { ...row, 
                    ministryId: isInc ? undefined : row.ministryId,
                    tagName: isInc ? undefined : row.tagName,
                    toSave: true,
                };
                return shouldApplyThesaurus ? applyThesaurus(toSaveRow) : toSaveRow;
            });
            
            // 마지막행에 데이터 입력할 경우, 마지막행 추가
            const currentIndex = prev.findIndex(
                (row) => row.rowKey === params.data?.rowKey,
            );
            if(currentIndex !== prev.length - 1) return nextRows;
            return [...nextRows, createEmptyRow()];
        });
    };

    const removeRow = useCallback((rowKey?: string) => {
        setRows((prev) => {
            if (prev.length === 1) return prev;
            return prev.filter((row) => row.rowKey !== rowKey);
        });
    }, []);

    const saveRows = async () => {
        const saveRows = rows.filter((row) => row.toSave);
        if(saveRows.length === 0) return alert(`저장할 항목이 없습니다.`);
        if(!confirm(`총 ${saveRows.length}건의 데이터를 저장하시겠습니까?`)) return;

        const parsedResult = z.array(
            entryUpdateRequestSchema.extend({
                entryType: z.enum(["inc", "exp"], { error: "구분이 선택되지 않았습니다."}),
                accountId: z.number({ error: "계좌가 선택되지 않았습니다." }),
                date: z.string({ error: "거래일이 입력되지 않았습니다." }),
                amount: z.number({ error: "금액이 입력되지 않았습니다. "}).int("금액은 정수로 입력해야합니다."),
                connection: z.string({ error: "거래처가 입력되지 않았습니다." }).trim().min(1, "거래처가 입력되지 않았습니다."),
            }).superRefine((row, ctx) => {
                if(row.entryType === "exp" && !row.ministryId) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["ministryId"],
                        message: "소비부처가 입력되지 않았습니다.",
                    })
                }
            }),
        ).safeParse(saveRows);

        if(!parsedResult.success) {
            const errorHandler = createErrorHandler();
            errorHandler.collect(parsedResult.error);
            errorHandler.flush();
            return;
        }

        await resolveMutateAsync({ data: parsedResult.data });
    };

    const columnDefs = useMemo<ColDef<Entry>[]>(() => [
        {
            field: "entryType",
            headerName: "구분",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: { values: Array.from(entryTypeCodeMap.keys()), },
            valueFormatter: ({ value }) => entryTypeCodeMap.get(value) ?? "선택",
            cellClassRules: { "text-gray-400": (params) => params.value == null || params.value === "", },
        },
        {
            field: "accountId",
            headerName: "계좌",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: { values: Array.from(accountMap.keys()), },
            valueFormatter: ({ value }) => accountMap.get(value) ?? "선택",
            cellClassRules: { "text-gray-400": (params) => params.value == null || params.value === "", },
        },
        {
            field: "date",
            headerName: "거래일",
            editable: true,
            cellEditor: "agDateStringCellEditor",
            cellRenderer: (params: ICellRendererParams) => {
                if(params.value) return params.value;
                return (
                    <span className="text-gray-400">
                        yyyy-mm-dd
                    </span>
                )
            },
        },
        {
            field: "amount",
            headerName: "금액",
            editable: true,
            cellEditor: "agNumberCellEditor",
            cellClass: "text-right",
            valueFormatter: ({ value }) => {
                if (value == null || value === "") return "";

                return Number(value).toLocaleString("ko-KR");
            },
        },
        {
            field: "memo",
            headerName: "메모",
            editable: true,
        },
        {
            field: "connection",
            headerName: "거래처",
            editable: true,
        },
        {
            field: "ministryId",
            headerName: "소비부처",
            editable: (params) => params.data?.entryType === "exp",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: { values: Array.from(ministryMap.keys()), },
            valueFormatter: ({ value }) => ministryMap.get(value) ?? "선택",
            cellClassRules: { 
                "text-gray-400": (params) => params.value == null || params.value === "", 
            },
        },
        {
            field: "tagName",
            headerName: "소비태그",
            editable: (params) => params.data?.entryType === "exp",
        },
        {
            colId: "deleteButton",
            headerName: "",
            sortable: false,
            filter: false,
            editable: false,
            cellRenderer: (params: ICellRendererParams<Entry>) => {
                return (
                <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm"
                    onClick={() => {removeRow(params.data?.rowKey)}}
                >
                    삭제
                </button>
                );
            },
        },
    ], [entryTypeCodeMap, accountMap, ministryMap, removeRow]);

    return (
        <div>
            <AgGridProvider modules={[AllCommunityModule]}>
                <section className="flex h-[calc(100vh-250px)] flex-col space-y-4 overflow-hidden">
                    <h1 className="shrink-0 text-xl font-bold">재무데이터 입력</h1>

                    <div className="min-h-0 flex-1">
                        <AgGridReact<Entry>
                            rowData={rows}
                            columnDefs={columnDefs}
                            defaultColDef={{
                                sortable: false,
                                filter: false,
                                flex: 1,
                            }}
                            onCellValueChanged={modifyRow}
                            singleClickEdit={true}
                            stopEditingWhenCellsLoseFocus={true}
                        />
                    </div>
                </section>
            </AgGridProvider>
            <div className="flex items-center justify-end">
                <button type="button" className="cm-button" onClick={() => { void saveRows(); }}>
                    거래내역 저장
                </button>
            </div>
        </div>
    );
};
