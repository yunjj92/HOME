import { AccountList } from "../../components/account/AccountList";
import { useAccountManagementView } from "../../hooks/management/useAccountManagementView";
import { AccountListSkeleton } from "../../components/account/AccountListSkeleton";
import { useState } from "react";
import { BankManagementModal } from "../../components/account/BankManagementModal";

export const AccountManagementView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiState = useAccountManagementView();

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

    const { accounts, banks, accountTypeCodes, currencyTypeCodes } = apiState.data;
    
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
                <AccountList accounts={accounts} banks={banks} accountTypeCodes={accountTypeCodes} currencyTypeCodes={currencyTypeCodes} />
            </div>

            {isModalOpen && (
                <BankManagementModal
                    bankList={banks ?? []}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </section>
    );
}