"use client";

import EnrollmentOverview from "@/app/components/enrollment/enrollmentOverview";
import Header from "@/app/components/header";
import { Enrollment } from "@/../types";
import { useEffect, useState } from "react";
import enrollmentService from "@/../service/enrollmentService";

const EnrollmentsPage: React.FC = () => { 
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        getEnrollments();
    }, []);
    
    const getEnrollments = async () => {
        setLoading(true);
        try {
            const response = await enrollmentService.getAllEnrollments();
            const data = await response.json();
            setEnrollments(data);
        } catch (error) {
            console.error("Failed to fetch enrollments:", error);
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
                                <h1 className="text-2xl font-bold">Enrollments</h1>
                                <p className="text-text-light">View and manage member enrollments</p>
                            </header>
                            
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-pulse text-primary">Loading enrollments...</div>
                                </div>
                            ) : (
                                <EnrollmentOverview enrollments={enrollments} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EnrollmentsPage;
