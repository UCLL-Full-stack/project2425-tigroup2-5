const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllClubs = () => {
    return fetch(API_URL + "/club", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const clubService = {
    getAllClubs
};

export default clubService;