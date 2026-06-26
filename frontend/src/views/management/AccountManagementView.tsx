import { AccountList } from "../../components/management/AccountList";
import { useEffect, useMemo, useState } from "react";
import { useGetAccounts, useGetBanks, useGetCodes } from "../../api/generated";
import z from "zod";
import { accountDataSchema } from "../../api/zod/accountResponse.zod";
import { bankDataSchema } from "../../api/zod/bankResponse.zod";
import { codeDataSchema } from "../../api/zod/codeResponse.zod";
import { useListMapping } from "../../hooks/common/useListMapping";
import { useCodesMapping } from "../../hooks/common/useCodesMapping";
import { AccountListSkeleton } from "../../components/management/AccountListSkeleton";
import { AccountListEdit } from "../../components/management/AccountListEdit";
import { createErrorHandler } from "../../utils/errorHandler.ts";
import { COMMON_QUERY_CONFIG } from "../../constants/queryConfig.ts";

export const AccountManagementView = () => {
    // 데이터 useQuery로 불러오기
    const {
        isLoading: isAccountsLoading,
        error: accountsError,
        data: accountsData,
    } = useGetAccounts(COMMON_QUERY_CONFIG);
    const {
        isLoading: isBanksLoading,
        error: banksError,
        data: banksData,
    } = useGetBanks(COMMON_QUERY_CONFIG);
    const {
        isLoading: isAccountTypeCodesLoading,
        error: accountTypeCodesError,
        data: accountTypeCodesData,
    } = useGetCodes({ typeId: 1 }, COMMON_QUERY_CONFIG);
    const {
        isLoading: isCurrencyTypeCodesLoading,
        error: currencyTypeCodesError,
        data: currencyTypeCodesData,
    } = useGetCodes({ typeId: 2 }, COMMON_QUERY_CONFIG);

    // 로딩, 에러 체크
    const isLoading = isAccountsLoading || isBanksLoading || isAccountTypeCodesLoading || isCurrencyTypeCodesLoading;

    // 데이터 파싱
    const accountsParsed = useMemo(
        () => z.array(accountDataSchema).safeParse(accountsData?.data),
        [accountsData?.data],
    );
    const banksParsed = useMemo(
        () => z.array(bankDataSchema).safeParse(banksData?.data),
        [banksData?.data],
    );
    const accountTypeCodesParsed = useMemo(
        () => z.array(codeDataSchema).safeParse(accountTypeCodesData?.data),
        [accountTypeCodesData?.data],
    );
    const currencyTypeCodesParsed = useMemo(
        () => z.array(codeDataSchema).safeParse(currencyTypeCodesData?.data),
        [currencyTypeCodesData?.data],
    );
    
    // 에러 체크
    useEffect(() => {
        if (isLoading) return;

        const errorHandler = createErrorHandler();
        errorHandler.collectResult({ error: accountsError, data: accountsData }, { source: "accounts" });
        errorHandler.collect(accountsParsed.error, { source: "accounts" });
        errorHandler.collectResult({ error: banksError, data: banksData }, { source: "banks" });
        errorHandler.collect(banksParsed.error, { source: "banks" });
        errorHandler.collectResult({ error: accountTypeCodesError, data: accountTypeCodesData }, { source: "accountTypeCodes" });
        errorHandler.collect(accountTypeCodesParsed.error, { source: "accountTypeCodes" });
        errorHandler.collectResult({ error: currencyTypeCodesError, data: currencyTypeCodesData }, { source: "currencyTypeCodes" });
        errorHandler.collect(currencyTypeCodesParsed.error, { source: "currencyTypeCodes" });

        errorHandler.flush();
    }, [
        isLoading,
        accountsError,
        accountsData,
        accountsParsed,
        banksError,
        banksData,
        banksParsed,
        accountTypeCodesError,
        accountTypeCodesData,
        accountTypeCodesParsed,
        currencyTypeCodesError,
        currencyTypeCodesData,
        currencyTypeCodesParsed,
    ]);

    // 데이터 할당
    const accounts = accountsParsed.success ? accountsParsed.data : [];
    const banks = banksParsed.success ? banksParsed.data : [];
    const accountTypeCodes = accountTypeCodesParsed.success ? accountTypeCodesParsed.data : [];
    const currencyTypeCodes = currencyTypeCodesParsed.success ? currencyTypeCodesParsed.data : [];

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
