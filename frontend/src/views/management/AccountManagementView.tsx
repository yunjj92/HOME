import { AccountList } from "../../components/management/AccountList";
import { useEffect, useState } from "react";
import { useGetAccounts, useGetBanks, useGetCodes } from "../../api/generated";
import z from "zod";
import { accountDataSchema } from "../../api/zod/accountResponse.zod";
import { bankDataSchema } from "../../api/zod/bankResponse.zod";
import { codeDataSchema } from "../../api/zod/codeResponse.zod";
import { useListMapping } from "../../hooks/common/useListMapping";
import { useCodesMapping } from "../../hooks/common/useCodesMapping";
import { parseToZodSchema } from "../../utils/parseToZodSchema";
import { AccountListSkeleton } from "../../components/management/AccountListSkeleton";
import { AccountListEdit } from "../../components/management/AccountListEdit";
import { createErrorHandler } from "../../utils/errorHandler.ts";

const queryConfig = {
    query: {
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
    }
};

export const AccountManagementView = () => {
    // 데이터 useQuery로 불러오기
    const {
        isLoading: isAccountsLoading,
        error: accountsError,
        data: accountsData,
    } = useGetAccounts(queryConfig);
    const {
        isLoading: isBanksLoading,
        error: banksError,
        data: banksData,
    } = useGetBanks(queryConfig);
    const {
        isLoading: isAccountTypeCodesLoading,
        error: accountTypeCodesError,
        data: accountTypeCodesData,
    } = useGetCodes({ typeId: 1 }, queryConfig);
    const {
        isLoading: isCurrencyTypeCodesLoading,
        error: currencyTypeCodesError,
        data: currencyTypeCodesData,
    } = useGetCodes({ typeId: 2 }, queryConfig);

    // 로딩, 에러 체크
    const isLoading = isAccountsLoading || isBanksLoading || isAccountTypeCodesLoading || isCurrencyTypeCodesLoading;

    useEffect(() => {
        if (isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: accountsError, data: accountsData }, { source: "accounts" });
        errorHandler.collectResult({ error: banksError, data: banksData }, { source: "banks" });
        errorHandler.collectResult({ error: accountTypeCodesError, data: accountTypeCodesData }, { source: "accountTypeCodes" });
        errorHandler.collectResult({ error: currencyTypeCodesError, data: currencyTypeCodesData }, { source: "currencyTypeCodes" });
        errorHandler.flush();
    }, [
        isLoading,
        accountsError,
        accountsData,
        banksError,
        banksData,
        accountTypeCodesError,
        accountTypeCodesData,
        currencyTypeCodesError,
        currencyTypeCodesData,
    ]);

    // 데이터 파싱
    const accounts = parseToZodSchema(accountsData?.data, z.array(accountDataSchema), []);
    const banks = parseToZodSchema(banksData?.data, z.array(bankDataSchema), []);
    const accountTypeCodes = parseToZodSchema(accountTypeCodesData?.data, z.array(codeDataSchema), []);
    const currencyTypeCodes = parseToZodSchema(currencyTypeCodesData?.data, z.array(codeDataSchema), []);

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
