import z from "zod";
import { useGetBanks } from "../../api/generated"
import { checkError } from "../../util/checkError";
import { checkLoading } from "../../util/checkLoading";
import { parseToZodSchema } from "../../util/parseToZodSchema";
import { bankDataSchema } from "../../api/zod/bankResponse.zod";
import { useState } from "react";
import { BankList } from "../../components/account/BankList";
import { BankListSkeleton } from "../../components/account/BankListSkeleton";
import { BankListEdit } from "../../components/account/BankListEdit";

const queryConfig = {
    query: {
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    }
};

export const BankManagementView = () => {
    const getBankResult = useGetBanks(queryConfig);
    
    const isLoading = checkLoading(getBankResult);
    checkError(getBankResult);

    const banks = parseToZodSchema(getBankResult.data?.data, z.array(bankDataSchema), []);

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