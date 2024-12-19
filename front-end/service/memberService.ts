const getAllMembers = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/member", {
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