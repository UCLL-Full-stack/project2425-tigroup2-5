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

const getEmployeeByEmail = async (email: string): Promise<Employee | null> => {
    const employeePrisma = await database.employee.findFirst({
        where: {
            person: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        },
        include: { person: true }
    });

    return employeePrisma ? Employee.from(employeePrisma) : null;
}

const updateEmployee = async (employeeId: number, employeeData: Partial<Employee>): Promise<Employee | null> => {
    const { person: personData, ...employeeOnly } = employeeData;

    let personConnect;
    if (personData?.id) {
        personConnect = { connect: { id: personData.id } };
    } else if (personData) {
        const createdPerson = await database.person.create({
            data: {
                firstName: personData.firstname || '',
                lastName: personData.surname || '',
                email: personData.email || '',
                phone: personData.phone || '',
                ...(personData.birthDate ? { birthDate: personData.birthDate } : {})
            }
        });
        personConnect = { connect: { id: createdPerson.id } };
    }

    const updatedEmployeePrisma = await database.employee.update({
        where: { id: employeeId },
        data: {
            ...employeeOnly,
            person: personConnect,
            id: undefined // Ensure 'id' is excluded from the update data
        },
        include: { person: true }
    });

    return updatedEmployeePrisma ? Employee.from(updatedEmployeePrisma) : null;
}

const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
    const { person: personData, ...employeeOnly } = employeeData;
    
    if (!personData?.id && !employeeData.person?.id) {
        throw new Error('Creating an employee requires a personId');
    }
    
    const personId = personData?.id || employeeData.person?.id;

    try {
        const employeePrisma = await database.employee.create({
            data: {
                admin: employeeOnly.admin || false,
                title: employeeOnly.title || '',
                salary: employeeOnly.salary || 0,
                personId: personId as number
            },
            include: { person: true }
        });

        return Employee.from(employeePrisma);
    } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error(`Failed to create employee: ${(error as Error).message}`);
    }
}

export default { getAllEmployees, getEmployeeById, getEmployeeByEmail, updateEmployee, createEmployee };