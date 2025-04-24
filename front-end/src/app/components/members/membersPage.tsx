import { Member } from "@/../types/";
import Link from "next/link";

type Props = {
    members: Array<Member>;
};

const MembersPage: React.FC<Props> = ({members}) => {
    if (!members || members.length === 0) {
        return (
            <div className="text-center py-8 text-text-light">
                No members found. New members will appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-sm text-text-light">
                        Showing <span className="font-medium">{members.length}</span> members
                    </span>
                </div>
                <Link href="/pages/signup" className="btn btn-primary text-sm">
                    + Add Member
                </Link>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-card-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            First Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Last Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                    {members.map((member: Member) => (
                        <tr 
                            key={member.id} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {member.id}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {member.person?.firstname || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {member.person?.surname || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {member.person?.email || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {member.person?.phone || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm text-right space-x-1">
                                <button className="btn-outline py-1 px-2 text-xs">
                                    View
                                </button>
                                <button className="btn-outline py-1 px-2 text-xs">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MembersPage;