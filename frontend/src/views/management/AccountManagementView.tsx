import { AccountList } from "../../components/account/AccountList";
import { useState } from "react";
import { useGetAccounts, useGetBanks, useGetCodes } from "../../api/generated";
import z from "zod";
import { accountDataSchema } from "../../api/zod/accountResponse.zod";
import { bankDataSchema } from "../../api/zod/bankResponse.zod";
import { codeDataSchema } from "../../api/zod/codeResponse.zod";
import { useListMapping } from "../../hooks/common/useListMapping";
import { useCodesMapping } from "../../hooks/common/useCodesMapping";
import { parseToZodSchema } from "../../util/parseToZodSchema";
import { AccountListSkeleton } from "../../components/account/AccountListSkeleton";
import { checkLoading } from "../../util/checkLoading";
import { AccountListEdit } from "../../components/account/AccountListEdit";
import { checkError } from "../../util/checkError";

const queryConfig = {
    query: {
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    }
};

export const AccountManagementView = () => {
    // 데이터 useQuery로 불러오기
    const getAccountsResult = useGetAccounts(queryConfig);
    const getBankResult = useGetBanks(queryConfig);
    const getAccountTypeCodesResult = useGetCodes({ typeId: 1 }, queryConfig);
    const getCurrencyTypeCodesResult = useGetCodes({ typeId: 2 }, queryConfig);

    // 로딩, 에러 체크
    const isLoading = checkLoading(getAccountsResult, getBankResult, getAccountTypeCodesResult, getCurrencyTypeCodesResult);
    checkError(getAccountsResult, getBankResult, getAccountTypeCodesResult, getCurrencyTypeCodesResult);

    // 데이터 파싱
    const accounts = parseToZodSchema(getAccountsResult.data?.data, z.array(accountDataSchema), []);
    const banks = parseToZodSchema(getBankResult.data?.data, z.array(bankDataSchema), []);
    const accountTypeCodes = parseToZodSchema(getAccountTypeCodesResult.data?.data, z.array(codeDataSchema), []);
    const currencyTypeCodes = parseToZodSchema(getCurrencyTypeCodesResult.data?.data, z.array(codeDataSchema), []);

    // 맵핑 데이터 생성
    const bankMap = useListMapping(banks, "id", "name");
    const accountTypeCodeMap = useCodesMapping(accountTypeCodes);
    const currencyTypeCodeMap = useCodesMapping(currencyTypeCodes);

    // 상태관리
    const [isEditMode, setIsEditMode] = useState(false);
    
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">계좌 관리</h1>
            </div>

            <div>
                <table className="cm-table">
                    <thead className="cm-thead">
                        <tr className="cm-thead-tr">
                            <th className="cm-th">계좌명</th>
                            <th className="cm-th">은행명</th>
                            <th className="cm-th">계좌종류</th>
                            <th className="cm-th">소유주</th>
                            <th className="cm-th">계좌통화</th>
                            <th className="cm-th">계좌번호</th>
                            <th className="cm-th">설명</th>
                            <th className="cm-th">생성일</th>
                            <th className="cm-th">최종수정일</th>
                        </tr>
                    </thead>
                    {isLoading ? (
                        <AccountListSkeleton></AccountListSkeleton>
                    ) : !isEditMode ? (
                        <AccountList accounts={accounts} bankMap={bankMap} accountTypeCodeMap={accountTypeCodeMap} currencyTypeCodeMap={currencyTypeCodeMap} />
                    ) : (
                        <AccountListEdit accounts={accounts} bankMap={bankMap} accountTypeCodeMap={accountTypeCodeMap} currencyTypeCodeMap={currencyTypeCodeMap} setIsEditModeFalse={() => setIsEditMode(false)} />
                    )}
                </table>
            </div>

            <div className="flex items-center justify-end">
                <button type="button" className={!isEditMode ? "cm-button" : "hidden"} onClick={() => setIsEditMode(true)}>
                    계좌정보 수정
                </button>
            </div>
        </section>
    );
}