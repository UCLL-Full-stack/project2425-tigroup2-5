const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllMembers = () => {
    return fetch(API_URL + "/member", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const memberService = {
    getAllMembers
};

export default memberService;