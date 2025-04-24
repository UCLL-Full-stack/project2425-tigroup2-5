const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllEmployments = () => {
    return fetch(API_URL + "/employment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const employmentService = {
    getAllEmployments
};

export default employmentService;