import { Skeleton } from "../common/Skeleton";

export function AccountListSkeleton() {
    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">은행명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌타입</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">소유주</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌통화</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">계좌번호</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">설명</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">생성일</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-600">최종수정일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                        <td className="px-4 py-3 text-center"><Skeleton className="h-5 w-1/1" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}