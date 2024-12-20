const getAllClubs = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/Club", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const ClubService = {
    getAllClubs
};

export default ClubService;