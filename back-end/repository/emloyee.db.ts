import { Employee } from '../model/employee';
import { Club } from '../model/club';
import { Person } from '../model/person';

let currentId = 1;

const employees: Employee[] = [
];

const addEmployee = (club: Club, person: Person, salary: number): void => {
    employees.push(new Employee({id: currentId++, club, person, salary}));
}

const getAllEmployees = (): Employee[] => employees;

const getEmployeeById = (id: number): Employee | undefined => employees.find((employee) => employee.id === id);

export default { addEmployee, getAllEmployees, getEmployeeById };