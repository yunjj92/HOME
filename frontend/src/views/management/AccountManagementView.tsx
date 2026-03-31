import { useInitAccountManagement } from "../../api/generated";
import { initAccountManagementResponseSchema } from "../../schemas/account/account-management";
import { BankList } from "../../components/account/BankList";
import { AccountList } from "../../components/account/AccountList";

export function AccountManagementView() {
    const { data, isLoading, error } = useInitAccountManagement();

    if(isLoading) return <div>로딩중</div>;

    if(error) {
        return (
            <div>
                <div>message: {error.message}</div>
                <div>status: {error.response?.status}</div>
            </div>
        );
    }

    const parsed = initAccountManagementResponseSchema.safeParse(data?.data);

    if(!parsed.success) {
        return <div>응답 구조 오류</div>;
    }

    const response = parsed.data;
    const realData = response.data;

    return (
        <div>
            <div>은행 수: {realData.bankResultList.length}</div>
            <div>계좌 수: {realData.accountResultList.length}</div>

            <h3>은행 목록</h3>
            <BankList banks={realData.bankResultList} />
            
            <h3>계좌 목록</h3>
            <AccountList accounts={realData.accountResultList} />
        </div>
    );
}