
"use client";


import EmploymentOverview from "@/app/components/employment/employmentOverview";
import Header from "@/app/components/header";
import { Employment } from "@/../types";
import { useEffect, useState } from "react";
import employmentService from "@/../service/employmentService";

const EmploymentsPage: React.FC = () => { 
    const [employments, setEmployments] = useState<Employment[]>([]);
    
    useEffect(() => {
        getMembers();
    }, []);
    
    const getMembers = async () => {
        const response = await employmentService.getAllEmployments();
        const data = await response.json();
        setEmployments(data);
    }
    
    return (
        <>
        <Header></Header>
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl text-gray-700 font-bold mb-2">Employments</h1>
                <h2 className="text-lg text-gray-700">These are the employments</h2>
                <EmploymentOverview employments={employments}></EmploymentOverview>
            </div>
        </div>
    </>
    )
}
export default EmploymentsPage;
