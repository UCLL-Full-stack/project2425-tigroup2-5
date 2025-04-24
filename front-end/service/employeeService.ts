const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllEmployees = () => {
    return fetch(API_URL + "/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const employeeService = {
    getAllEmployees
};

export default employeeService;