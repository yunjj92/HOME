import { useGetAccountsQuery } from "../account/useGetAccountsQuery";
import { useGetBanksQuery } from "../account/useGetBanksQuery";

export function useAccountManagementView() {
    const accountsApiResponse = useGetAccountsQuery();
    const banksApiResponse = useGetBanksQuery();

    if(accountsApiResponse.status !== 'success') return accountsApiResponse;
    if(banksApiResponse.status !== 'success') return banksApiResponse;
    
    return {
        status: "success",
        data: {
            accountResultList: accountsApiResponse.data,
            bankResultList: banksApiResponse.data,
        },
    } as const;
}
