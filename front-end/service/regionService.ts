const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllRegions = () => {
    return fetch(API_URL + "/region", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const regionService = {
    getAllRegions
};

export default regionService;