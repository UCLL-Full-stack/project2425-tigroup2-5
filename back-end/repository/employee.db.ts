import { Employee } from '../model/employee';
import { Club } from '../model/club';
import { Person } from '../model/person';

let currentId = 1;

const employees: Employee[] = [
];

const addEmployee = ( person: Person, salary: number ): void => {
    employees.push(new Employee({id: currentId++, person, salary, employments: []}));
}

const getAllEmployees = (): Employee[] => employees;

const getEmployeeById = (id: number): Employee | undefined => employees.find((employee) => employee.id === id);

export default { addEmployee, getAllEmployees, getEmployeeById };