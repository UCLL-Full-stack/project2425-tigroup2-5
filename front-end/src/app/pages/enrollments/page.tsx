
"use client";


import EnrollmentOverview from "@/app/components/enrollment/enrollmentOverview";
import Header from "@/app/components/header";
import { Enrollment } from "@/../types";
import { useEffect, useState } from "react";
import enrollmentService from "@/../service/enrollmentService";

const EnrollmentsPage: React.FC = () => { 
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    
    useEffect(() => {
        getMembers();
    }, []);
    
    const getMembers = async () => {
        const response = await enrollmentService.getAllEnrollments();
        const data = await response.json();
        console.log(data);
        setEnrollments(data);
    }
    
    return (
        <>
        <Header></Header>
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl text-gray-700 font-bold mb-2">Enrollments</h1>
                <h2 className="text-lg text-gray-700">These are the enrollments</h2>
                <EnrollmentOverview enrollments={enrollments}></EnrollmentOverview>
            </div>
        </div>
    </>
    )
}
export default EnrollmentsPage;
