const getAllEmployments = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/employment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const EmploymentService = {
    getAllEmployments,
};

export default EmploymentService;