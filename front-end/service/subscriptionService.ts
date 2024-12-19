const getAllSubscriptions = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/Subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const SubscriptionService = {
    getAllSubscriptions
};

export default SubscriptionService;