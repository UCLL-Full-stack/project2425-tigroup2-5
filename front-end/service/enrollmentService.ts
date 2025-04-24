const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllEnrollments = () => {
    return fetch(API_URL + "/enrollment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const enrollmentService = {
    getAllEnrollments
};

export default enrollmentService;