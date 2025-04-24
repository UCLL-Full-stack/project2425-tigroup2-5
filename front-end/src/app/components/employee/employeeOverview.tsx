import { Employee } from "@/../types/";

type Props = {
    employees: Array<Employee>;
};

const EmployeeOverview: React.FC<Props> = ({employees}) => {
    if (!employees || employees.length === 0) {
        return (
            <div className="text-center py-8 text-text-light">
                No employees found. New employees will appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <span className="text-sm text-text-light">
                        Showing <span className="font-medium">{employees.length}</span> employees
                    </span>
                </div>
                <button className="btn btn-primary text-sm">
                    + Add Employee
                </button>
            </div>
            
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-card-border">
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                            Admin
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
                            Salary
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                    {employees.map((employee: Employee) => (
                        <tr 
                            key={employee.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {employee.id}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employee.admin ? "Yes" : "No"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employee.person?.firstname || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employee.person?.surname || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employee.person?.email || "–"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                                {employee.salary || "–"}
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

export default EmployeeOverview;