import { Club } from "@/../types";
import Link from "next/link";

type Props = {
    clubs: Array<Club>;
};

const ClubOverview: React.FC<Props> = ({clubs}) => {
    if (!clubs || clubs.length === 0) {
        return (
            <div className="text-center py-8 text-text-light">
                No clubs found. New clubs will appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-sm text-text-light">
                        Showing <span className="font-medium">{clubs.length}</span> clubs
                    </span>
                </div>
                <button className="btn btn-primary text-sm">
                    + Add Club
                </button>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-card-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Address
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Region
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                    {clubs.map((club) => (
                        <tr 
                            key={club.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {club.id}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {club.address || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {club.region?.name || "–"}
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

export default ClubOverview;