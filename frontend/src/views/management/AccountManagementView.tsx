import { AccountList } from "../../components/account/AccountList";
import { useAccountManagementData } from "../../hooks/management/UseAccountManagementData";

export const AccountManagementView = () => {

    const {finalData, isLoading, isError} = useAccountManagementData();

    if(isLoading){
        return <div>로딩 중</div>;
    }  
    
    if(isError){
        return <div>확인 필요</div>;
    }


    const {accountResultList, bankResultList} = finalData ?? {}
    
    return (
        <div>
            <div>은행 수: {bankResultList?.length}</div>
            <div>계좌 수: {accountResultList?.length}</div>

            <h3>계좌 목록</h3>
            <AccountList accounts={accountResultList ?? []} banks={bankResultList ?? []} />
        </div>
    );
}