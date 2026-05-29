import z from "zod";
import { useGetMinistries } from "../../api/generated";
import { parseToZodSchema } from "../../util/parseToZodSchema";
import { ministryDataSchema } from "../../api/zod/ministryResponse.zod";
import { useEffect, useState } from "react";
import { MinistryListSkeleton } from "../../components/ministry/MinistryListSkeleton";
import { MinistryList } from "../../components/ministry/MinistryList";
import { MinistryListEdit } from "../../components/ministry/MinistryListEdit";
import { createErrorHandler } from "../../util/errorHandler.ts";


const queryConfig = {
    query: {
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    }
};

export const MinistryManagementView = () => {
    const {
        isLoading,
        error: ministriesError,
        data: ministriesData,
    } = useGetMinistries(queryConfig);

    useEffect(() => {
        if (isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: ministriesError, data: ministriesData }, { source: "ministries" });
        errorHandler.flush();
    }, [isLoading, ministriesError, ministriesData]);

    const ministries = parseToZodSchema(ministriesData?.data, z.array(ministryDataSchema), []);

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
