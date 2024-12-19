const getAllRegions = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/Region", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const RegionService = {
    getAllRegions
};

export default RegionService;