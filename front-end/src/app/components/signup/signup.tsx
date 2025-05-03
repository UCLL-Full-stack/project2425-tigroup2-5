"use client";

import Header from "../header";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "../../../../service/authService";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.firstname || !formData.surname || !formData.email || !formData.password || !formData.birthDate) {
            setError("All fields are required (except phone)");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        // Age validation
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 16) {
            setError("You must be at least 16 years old to register");
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Remove confirmPassword from the data being sent to the server
            const { confirmPassword, ...registrationData } = formData;
            
            await authService.register(registrationData);
            setSuccess("Registration successful! You can now log in.");
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push("/pages/login");
            }, 2000);
            
        } catch (err: unknown) {
            console.error("Registration error:", err);
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="card w-full max-w-md">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstname" className="form-label">First Name</label>
                                    <input 
                                        id="firstname"
                                        name="firstname"
                                        type="text" 
                                        placeholder="John" 
                                        className="form-input"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="surname" className="form-label">Last Name</label>
                                    <input 
                                        id="surname"
                                        name="surname"
                                        type="text" 
                                        placeholder="Doe" 
                                        className="form-input"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input 
                                    id="email"
                                    name="email"
                                    type="email" 
                                    placeholder="john.doe@example.com" 
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
                                <input 
                                    id="phone"
                                    name="phone"
                                    type="tel" 
                                    placeholder="+1 234 567 8900" 
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="birthDate" className="form-label">Birth Date</label>
                                <input 
                                    id="birthDate"
                                    name="birthDate"
                                    type="date" 
                                    className="form-input"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password"
                                    name="password"
                                    type="password" 
                                    placeholder="Create a secure password" 
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input 
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password" 
                                    placeholder="Confirm your password" 
                                    className="form-input"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button 
                                    className={`btn btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-5 text-center text-sm text-text-light">
                            Already have an account? 
                            <Link href="/pages/login" className="ml-1 text-primary hover:underline">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupScreen;