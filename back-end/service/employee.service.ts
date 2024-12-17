import emloyeeDb from "../repository/emloyee.db";
import { Employee } from "../model/employee";
import { EmployeeInput } from "../types";
import clubService from "./club.service";
import personService from "./person.service";

const addEmployee = async({clubId, personNrn, salary}: EmployeeInput): Promise<void> => {
    const club = await clubService.getClubById(clubId);
    const person = await personService.getPersonByNrn(personNrn);
    await emloyeeDb.addEmployee( club, person , salary);
};

const getAllEmployees = async(): Promise<Employee[]> => emloyeeDb.getAllEmployees();

const getEmployeeById = async(id: number): Promise<Employee> => {
    const employee = await emloyeeDb.getEmployeeById(id);
    if(employee === undefined) throw new Error(`Employee with id ${id} not found`);
    return employee;
};

export default { addEmployee, getAllEmployees, getEmployeeById };