import apiClient from './apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const getAllEnrollments = () => {
    return fetch(API_URL + "/enrollment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });  
};

const createEnrollment = (enrollmentData: { 
    memberId: number; 
    subscriptionId: number; 
    clubId?: number;
    regionId?: number;
    enrollmentDate: Date;
    expirationDate: Date;
}) => {
    return fetch(API_URL + "/enrollment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
    });
};

const getMemberEnrollments = async (memberId: number) => {
    return apiClient.get(`/member/${memberId}/enrollments`);
};

const enrollmentService = {
    getAllEnrollments,
    createEnrollment,
    getMemberEnrollments
};

export default enrollmentService;