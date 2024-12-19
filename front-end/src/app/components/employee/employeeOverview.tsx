import { Employee } from "@/../types/";

type Props = {
    employees: Array<Employee>;
};

const EmployeeOverview: React.FC<Props> = ({employees}) => {

    return (
        <>

        {employees && (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped">
                                <thead className="text-black">
                                    <tr>
                                        <th>ID</th>
                                        <th>Admin</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Salary</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {employees.map((employee: Employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.admin}</td>
                                            <td>{employee.person?.firstname}</td>
                                            <td>{employee.person?.surname}</td>
                                            <td>{employee.person?.email}</td>
                                            <td>{employee.salary}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
        }
        </>
    );
};

export default EmployeeOverview;