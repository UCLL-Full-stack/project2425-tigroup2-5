"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import employeeService from "../../../../../service/employeeService";
import personService from "../../../../../service/personService";

interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

const AddEmployee = () => {
    const [personId, setPersonId] = useState<string>("");
    const [title, setTitle] = useState("");
    const [admin, setAdmin] = useState(false);
    const [salary, setSalary] = useState<string>("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch persons for dropdown
    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await personService.getAllPersons();
                const data = await response.json();
                setPersons(data);
            } catch (error) {
                console.error("Error fetching persons:", error);
                setError("Failed to load persons. Please try again later.");
            }
        };

        fetchPersons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!personId || !title || !password) {
            setError("Person, title, and password are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await employeeService.createEmployee({
                personId: parseInt(personId),
                admin,
                title,
                salary: salary ? parseFloat(salary) : undefined,
                password
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create employee");
            }

            // Redirect back to employees list
            router.push("/pages/employees");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to create employee. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <div className="p-6">
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold">Add New Employee</h1>
                                <p className="text-text-light">Create a new employee account</p>
                            </header>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="person" className="form-label">
                                        Person
                                    </label>
                                    <select
                                        id="person"
                                        className="form-select"
                                        value={personId}
                                        onChange={(e) => setPersonId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a person</option>
                                        {persons.map((person) => (
                                            <option key={person.id} value={person.id}>
                                                {person.firstName} {person.lastName} ({person.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="title" className="form-label">
                                        Job Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter job title"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="salary" className="form-label">
                                        Salary (optional)
                                    </label>
                                    <input
                                        id="salary"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-input"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                        placeholder="Enter salary"
                                    />
                                </div>
                                
                                <div className="flex items-center">
                                    <input
                                        id="admin"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        checked={admin}
                                        onChange={(e) => setAdmin(e.target.checked)}
                                    />
                                    <label htmlFor="admin" className="ml-2 block text-sm">
                                        Administrator privileges
                                    </label>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            className="form-input"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            className="form-input"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Employee"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddEmployee;