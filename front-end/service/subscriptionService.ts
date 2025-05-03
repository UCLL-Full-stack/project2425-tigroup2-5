import apiClient from './apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllSubscriptions = () => {
    return fetch(API_URL + "/subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const getMemberSubscriptions = async (memberId: number) => {
    return apiClient.get(`/member/${memberId}/subscriptions`);
};

const subscriptionService = {
    getAllSubscriptions,
    getMemberSubscriptions
};

export default subscriptionService;