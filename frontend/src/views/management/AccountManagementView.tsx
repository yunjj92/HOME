import { AccountList } from "../../components/account/AccountList";
import { useAccountManagementData } from "../../hooks/management/UseAccountManagementData";

export function AccountManagementView() {

    const response = useAccountManagementData();

    switch(response.status) {
        case "loading":
            return <div>로딩 중</div>;
        case "error":
            return (
                <div>
                    <div>message: {response.message}</div>
                    <div>status: {response.code}</div>
                </div>
            );
        default:
            break;
    }

    const { accountResultList, bankResultList } = response.data;
    
    return (
        <div>
            <div>은행 수: {bankResultList.length}</div>
            <div>계좌 수: {accountResultList.length}</div>

            <h3>계좌 목록</h3>
            <AccountList accounts={accountResultList} banks={bankResultList} />
        </div>
    );
}