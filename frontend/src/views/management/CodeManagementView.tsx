import { useEffect, useMemo, useState } from "react";
import { useGetCodes, useGetTypes } from "../../api/generated"
import { COMMON_QUERY_CONFIG } from "../../constants/queryConfig"
import { createErrorHandler } from "../../utils/errorHandler";
import z from "zod";
import { codeDataSchema } from "../../api/zod/codeResponse.zod";
import { typeDataSchema } from "../../api/zod/typeResponse.zod";
import { CodeList } from "../../components/management/CodeList";
import { CodeListEdit } from "../../components/management/CodeListEdit";
import { TypeList } from "../../components/management/TypeList";
import { TypeListEdit } from "../../components/management/TypeListEdit";

export const CodeManagementView = () => {
    const {
        isLoading: isTypesLoading,
        error: typesError,
        data: typesData,
    } = useGetTypes(COMMON_QUERY_CONFIG);

    const {
        isLoading: isCodesLoading,
        error: codesError,
        data: codesData,
    } = useGetCodes({}, COMMON_QUERY_CONFIG);

    const isLoading = isTypesLoading || isCodesLoading;

    const typesParsed = useMemo(
        () => z.array(typeDataSchema).safeParse(typesData?.data),
        [typesData?.data],
    );

    const codesParsed = useMemo(
        () => z.array(codeDataSchema).safeParse(codesData?.data),
        [codesData?.data],
    );

    useEffect(() => {
        if(isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: typesError, data: typesData }, { source: "types"});
        errorHandler.collect(typesParsed.error, { source: "types"});
        errorHandler.collectResult({ error: codesError, data: codesData }, { source: "codes"});
        errorHandler.collect(codesParsed.error, { source: "codes"});
        errorHandler.flush();
    }, [
        isLoading,
        typesError,
        typesData,
        typesParsed,
        codesError,
        codesData,
        codesParsed,
    ]);

    const types = useMemo(
        () => typesParsed.success ? typesParsed.data : [],
        [typesParsed],
    );
    const codes = useMemo(
        () => codesParsed.success ? codesParsed.data : [],
        [codesParsed],
    );

    const [selectedTypeId, setSelectedTypeId] = useState(1);

    const [isCodeEditMode, setIsCodeEditMode] = useState(false);
    const [isTypeEditMode, setIsTypeEditMode] = useState(false);

    const selectedCodes = useMemo(() => {
        return codes.filter((code) => code.typeId === selectedTypeId);
    }, [codes, selectedTypeId]);

    const onClickType = (typeId : number | undefined) => {
        if(isCodeEditMode) return;
        setSelectedTypeId(typeId ?? 0);
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">코드 관리</h1>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row items-start justify-between">
                <div className="lg:w-2/5 items-center justify-between">
                    <table className="cm-table">
                        <thead className="cm-thead">                            
                            <tr className="cm-thead-tr">
                                <th className="cm-th">코드종류</th>
                                <th className="cm-th">설명</th>
                                <th className="cm-th">생성일</th>
                                <th className="cm-th">최종수정일</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <div/>
                        ) : !isTypeEditMode ? (
                            <TypeList types={types} selectedTypeId={selectedTypeId} onClickType={onClickType} />
                        ) : (
                            <TypeListEdit types={types} onClickType={onClickType} setIsEditModeFalse={() => setIsTypeEditMode(false)} />
                        )}
                    </table>
                    <div className="flex items-center justify-end">
                        <button type="button" className={!isCodeEditMode && !isTypeEditMode ? "cm-button" : "hidden"} onClick={() => setIsTypeEditMode(true)}>
                            코드종류 수정
                        </button>
                    </div>
                </div>
                <div className="lg:w-3/5 items-center justify-between">
                    <table className="cm-table">
                        <thead className="cm-thead">                            
                            <tr className="cm-thead-tr">
                                <th className="cm-th">코드</th>
                                <th className="cm-th">코드명</th>
                                <th className="cm-th">설명</th>
                                <th className="cm-th">생성일</th>
                                <th className="cm-th">최종수정일</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <div/>
                        ) : !isCodeEditMode ? (
                            <CodeList codes={selectedCodes} />
                        ) : (
                            <CodeListEdit codes={selectedCodes} typeId={selectedTypeId} setIsEditModeFalse={() => setIsCodeEditMode(false)} />
                        )}
                    </table>
                    <div className="flex items-center justify-end">
                        <button type="button" className={!isCodeEditMode && !isTypeEditMode ? "cm-button" : "hidden"} onClick={() => setIsCodeEditMode(true)}>
                            코드 수정
                        </button>
                    </div>
                </div>
                
            </div>
        </section>
    );
}
