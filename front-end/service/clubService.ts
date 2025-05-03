const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllClubs = () => {
    return fetch(API_URL + "/club", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const createClub = (clubData: { address: string; regionId: number }) => {
    return fetch(API_URL + "/club", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
    });
};

const clubService = {
    getAllClubs,
    createClub
};

export default clubService;