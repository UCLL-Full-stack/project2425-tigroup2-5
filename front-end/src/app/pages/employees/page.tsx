"use client";

import EmployeeOverview from "@/app/components/employee/employeeOverview";
import Header from "@/app/components/header";
import AuthGuard from "@/app/components/auth/AuthGuard";
import { Employee } from "@/../types";
import { useEffect, useState } from "react";
import employeeService from "@/../service/employeeService";

const EmployeesPage: React.FC = () => {
    
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await employeeService.getAllEmployees();
            const data: Employee[] = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <AuthGuard requiredRoles={['admin']}>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="card">
                            <div className="p-6">
                                <header className="mb-6 flex justify-between items-center">
                                    <div>
                                        <h1 className="text-2xl font-bold">Employees</h1>
                                        <p className="text-text-light">View and manage gym staff</p>
                                    </div>
                                    <a href="/pages/employees/add" className="btn btn-primary">
                                        Add Employee
                                    </a>
                                </header>
                                
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-pulse text-primary">Loading employees...</div>
                                    </div>
                                ) : (
                                    <EmployeeOverview employees={employees} />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}

export default EmployeesPage;