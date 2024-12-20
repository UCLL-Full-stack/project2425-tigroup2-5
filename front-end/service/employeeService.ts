import { Employee } from "../types";

const getAllEmployees = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const loginEmployee = (employee: Employee) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/employee/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
    });
};

const EmployeeService = {
    getAllEmployees,
    loginEmployee,
};

export default EmployeeService;