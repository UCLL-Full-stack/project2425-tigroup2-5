import database from "../util/database";
import { Employee } from "../model/employee";

const getAllEmployees = async (): Promise<Employee[]> => {
    const employeesPrisma = await database.employee.findMany(
        {
            include: {
                person: true
            }
        }
    );
    return employeesPrisma.map((employeePrisma) => Employee.from(employeePrisma));
}

const getEmployeeById = async ({ id }: { id: number }): Promise<Employee | null> => {
    const employeePrisma = await database.employee.findUnique({
        where: { id },
        include: { person: true },
    });

    return employeePrisma ? Employee.from(employeePrisma) : null;
}

export default { getAllEmployees, getEmployeeById };