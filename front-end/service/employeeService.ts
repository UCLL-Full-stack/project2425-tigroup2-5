const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllEmployees = () => {
    return fetch(API_URL + "/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const createEmployee = (employeeData: { 
    personId: number; 
    admin: boolean; 
    title: string; 
    salary?: number;
    password: string;
}) => {
    return fetch(API_URL + "/employee", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
    });
};

const employeeService = {
    getAllEmployees,
    createEmployee
};

export default employeeService;