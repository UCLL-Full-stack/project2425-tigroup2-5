const getAllEnrollments = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/enrollment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
};

const enrollmentService = {
    getAllEnrollments,
};

export default enrollmentService;