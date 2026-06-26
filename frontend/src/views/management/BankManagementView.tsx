import z from "zod";
import { useGetBanks } from "../../api/generated"
import { bankDataSchema } from "../../api/zod/bankResponse.zod";
import { useEffect, useMemo, useState } from "react";
import { BankList } from "../../components/management/BankList";
import { BankListSkeleton } from "../../components/management/BankListSkeleton";
import { BankListEdit } from "../../components/management/BankListEdit";
import { createErrorHandler } from "../../utils/errorHandler.ts";
import { COMMON_QUERY_CONFIG } from "../../constants/queryConfig.ts";

export const BankManagementView = () => {
    const {
        isLoading,
        error: banksError,
        data: banksData,
    } = useGetBanks(COMMON_QUERY_CONFIG);

    const banksParsed = useMemo(
        () => z.array(bankDataSchema).safeParse(banksData?.data),
        [banksData?.data],
    );
    
    useEffect(() => {
        if (isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: banksError, data: banksData }, { source: "banks" });
        errorHandler.collect(banksParsed.error, { source: "banks" });
        errorHandler.flush();
    }, [isLoading, banksError, banksData, banksParsed]);

    const banks = banksParsed.success ? banksParsed.data : [];

    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">은행 관리</h1>
            </div>
            <div>
                <table className="cm-table">
                    <thead className="cm-thead">
                        <tr className="cm-thead-tr">
                            <th className="cm-th">은행명</th>
                            <th className="cm-th">등록일</th>
                            <th className="cm-th">최종수정일</th>
                        </tr>
                    </thead>
                    {isLoading ? (
                        <BankListSkeleton/>
                    ) : !isEditMode ? (
                        <BankList banks={banks}/>
                    ) : (
                        <BankListEdit banks={banks} setIsEditModeFalse={() => setIsEditMode(false)}/>
                    )}
                </table>
            </div>
            <div className="flex items-center justify-end">
                <button type="button" className={!isEditMode ? "cm-button" : "hidden"} onClick={() => {setIsEditMode(true)}}>
                    은행정보 수정
                </button>
            </div>
        </section>

    );
}
