const getAllEmployees = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/employee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const EmployeeService = {
    getAllEmployees
};

export default EmployeeService;