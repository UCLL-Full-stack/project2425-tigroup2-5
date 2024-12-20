"use client";

import EmployeeOverview from "@/app/components/employee/employeeOverview";
import Header from "@/app/components/header";
import { Employee } from "@/../types";
import { useEffect, useState } from "react";
import employeeService from "@/../service/employeeService";

const EmployeesPage: React.FC = () => {
    
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const response = await employeeService.getAllEmployees();
        const data = await response.json();
        setEmployees(data);
    }
    
    return (
        <>
        <Header></Header>
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl text-gray-700 font-bold mb-2">Employees</h1>
                <h2 className="text-lg text-gray-700">These are the employmees</h2>
                <EmployeeOverview employees={employees}></EmployeeOverview>
            </div>
        </div>
    </>
    )
}

export default EmployeesPage;