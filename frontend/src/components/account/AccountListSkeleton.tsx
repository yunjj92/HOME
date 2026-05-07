import { Skeleton } from "../common/Skeleton";

function ThisSkeleton() {
    return (<td className="cm-td"><Skeleton className="h-5 w-1/1" /></td>);
};

export function AccountListSkeleton() {
    return (
        <tbody>
            <tr className="cm-tbody-tr">
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
                <ThisSkeleton/>
            </tr>
        </tbody>
    );
};