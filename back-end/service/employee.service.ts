import employeeDb from "../repository/employee.db";
import { Employee } from "../model/employee";
import { EmployeeInput } from "../types";
import clubService from "./club.service";
import personService from "./person.service";

const getAllEmployees = async(): Promise<Employee[]> => employeeDb.getAllEmployees();

const getEmployeeById = async(id: number): Promise<Employee> => {
    const employee = await employeeDb.getEmployeeById({ id });
    if(employee === null) throw new Error(`Employee with id ${id} not found`);
    return employee;
};

// Add new function to create an employee properly
const createEmployee = async(employeeData: Partial<Employee>): Promise<Employee> => {
    return employeeDb.createEmployee(employeeData);
};

// Add new function to update an employee properly
const updateEmployee = async(id: number, employeeData: Partial<Employee>): Promise<Employee> => {
    const updatedEmployee = await employeeDb.updateEmployee(id, employeeData);
    if(updatedEmployee === null) throw new Error(`Employee with id ${id} not found`);
    return updatedEmployee;
};

export default { getAllEmployees, getEmployeeById, createEmployee, updateEmployee };