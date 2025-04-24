const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllSubscriptions = () => {
    return fetch(API_URL + "/subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const subscriptionService = {
    getAllSubscriptions
};

export default subscriptionService;