import { Employment } from "@/../types";

type Props = {
    employments: Array<Employment>;
};

const EmploymentOverview: React.FC<Props> = ({employments}) => {
    if (!employments || employments.length === 0) {
        return (
            <div className="text-center py-8 text-text-light">
                No employments found. New employments will appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-sm text-text-light">
                        Showing <span className="font-medium">{employments.length}</span> employments
                    </span>
                </div>
                <button className="btn btn-primary text-sm">
                    + Add Employment
                </button>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-card-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Employee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Club
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                    {employments.map((employment) => (
                        <tr 
                            key={employment.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {employment.id}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employment.employee?.person?.firstname || "–"} {employment.employee?.person?.surname || ""}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employment.club?.address || "–"}
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

export default EmploymentOverview;