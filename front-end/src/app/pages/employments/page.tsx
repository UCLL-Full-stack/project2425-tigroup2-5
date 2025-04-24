"use client";

import EmploymentOverview from "@/app/components/employment/employmentOverview";
import Header from "@/app/components/header";
import { Employment } from "@/../types";
import { useEffect, useState } from "react";
import employmentService from "@/../service/employmentService";

const EmploymentsPage: React.FC = () => { 
    const [employments, setEmployments] = useState<Employment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        getEmployments();
    }, []);
    
    const getEmployments = async () => {
        setLoading(true);
        try {
            const response = await employmentService.getAllEmployments();
            const data = await response.json();
            setEmployments(data);
        } catch (error) {
            console.error("Failed to fetch employments:", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="card">
                        <div className="p-6">
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold">Employments</h1>
                                <p className="text-text-light">View and manage staff assignments</p>
                            </header>
                            
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-pulse text-primary">Loading employments...</div>
                                </div>
                            ) : (
                                <EmploymentOverview employments={employments} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EmploymentsPage;
