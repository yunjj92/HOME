import { AccountList } from "../../components/account/AccountList";
import { useAccountManagementData } from "../../hooks/management/UseAccountManagementData";
import { AccountListSkeleton } from "../../components/account/AccountListSkeleton";
import { useState } from "react";
import { BankManagementModal } from "../../components/account/BankManagementModal";

export const AccountManagementView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiState = useAccountManagementData();

    switch(apiState.status) {
        case "loading":
            return <AccountListSkeleton />;
        case "error":
            return (
                <div>
                    <div>message: {apiState.message}</div>
                    <div>status: {apiState.code}</div>
                </div>
            );
        default:
            break;
    }

    const {accountResultList, bankResultList} = apiState.data;
    
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">계좌 관리</h1>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    은행 관리
                </button>
            </div>

            <div>
                <div>은행 수: {bankResultList?.length}</div>
                <div>계좌 수: {accountResultList?.length}</div>

                <h3>계좌 목록</h3>
                <AccountList accounts={accountResultList ?? []} banks={bankResultList ?? []} />
            </div>

            {isModalOpen && (
                <BankManagementModal
                    bankList={bankResultList ?? []}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
}