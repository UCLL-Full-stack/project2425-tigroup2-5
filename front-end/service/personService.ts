const getAllPersons = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/person", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
}

const PersonService = {
    getAllPersons,
};

export default PersonService;