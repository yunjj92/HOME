import { useGetAccountsQuery } from "../account/useGetAccountsQuery";
import { useGetBanksQuery } from "../account/useGetBanksQuery";
import { useGetCodesQuery } from "../common/useGetCodesQuery";

export function useAccountManagementView() {
    const accountsApiResponse = useGetAccountsQuery();
    const banksApiResponse = useGetBanksQuery();
    const accountTypeCodesApiResponse = useGetCodesQuery(1);
    const currencyTypeCodesApiResponse = useGetCodesQuery(2);

    if(accountsApiResponse.status !== 'success') return accountsApiResponse;
    if(banksApiResponse.status !== 'success') return banksApiResponse;
    if(accountTypeCodesApiResponse.status !== 'success') return accountTypeCodesApiResponse;
    if(currencyTypeCodesApiResponse.status !== 'success') return currencyTypeCodesApiResponse;
    
    return {
        status: "success",
        data: {
            accounts: accountsApiResponse.data,
            banks: banksApiResponse.data,
            accountTypeCodes: accountTypeCodesApiResponse.data,
            currencyTypeCodes: currencyTypeCodesApiResponse.data,
        },
    } as const;
}
