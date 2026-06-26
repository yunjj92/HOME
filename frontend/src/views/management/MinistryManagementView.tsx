import z from "zod";
import { useGetMinistries } from "../../api/generated";
import { ministryDataSchema } from "../../api/zod/ministryResponse.zod";
import { useEffect, useMemo, useState } from "react";
import { MinistryListSkeleton } from "../../components/management/MinistryListSkeleton";
import { MinistryList } from "../../components/management/MinistryList";
import { MinistryListEdit } from "../../components/management/MinistryListEdit";
import { createErrorHandler } from "../../utils/errorHandler.ts";
import { COMMON_QUERY_CONFIG } from "../../constants/queryConfig.ts";

export const MinistryManagementView = () => {
    const {
        isLoading,
        error: ministriesError,
        data: ministriesData,
    } = useGetMinistries(COMMON_QUERY_CONFIG);

    const ministriesParsed = useMemo(
        () => z.array(ministryDataSchema).safeParse(ministriesData?.data),
        [ministriesData?.data],
    );

    useEffect(() => {
        if (isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: ministriesError, data: ministriesData }, { source: "ministries" });
        errorHandler.collect(ministriesParsed.error, { source: "ministries" });
        errorHandler.flush();
    }, [isLoading, ministriesError, ministriesData, ministriesParsed]);

    const ministries = ministriesParsed.success ? ministriesParsed.data : [];

    // 상태관리
    const [isEditMode, setIsEditMode] = useState(false);
    
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">부처 관리</h1>
            </div>

            <div>
                <table className="cm-table">
                    <thead className="cm-thead">
                        <tr className="cm-thead-tr">
                            <th className="cm-th w-48">부처명</th>
                            <th className="cm-th">설명</th>
                            <th className="cm-th w-48">생성일</th>
                            <th className="cm-th w-48">최종수정일</th>
                        </tr>
                    </thead>
                    {isLoading ? (
                        <MinistryListSkeleton/>
                    ) : !isEditMode ? (
                        <MinistryList ministries={ministries} />
                    ) : (
                        <MinistryListEdit ministries={ministries} setIsEditModeFalse={() => setIsEditMode(false)} />
                    )}
                </table>
            </div>

            <div className="flex items-center justify-end">
                <button type="button" className={!isEditMode ? "cm-button" : "hidden"} onClick={() => setIsEditMode(true)}>
                    부처정보 수정
                </button>
            </div>
        </section>
    );
}
