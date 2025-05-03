"use client";

import Header from "../header";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState<"member" | "employee">("member");
    const [error, setError] = useState<string | null>(null);
    
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        console.log("Form submitted with values:", { email, password, userType });
        
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        setError(null);

        try {
            console.log(`Attempting to login as ${userType} with email: ${email}`);
            const userData = await login(email, password, userType);
            
            console.log("Login successful:", userData);
            
            if (userData.role === 'admin') {
                router.push('/pages/employees'); // Admin dashboard
            } else if (userData.role === 'employee') {
                router.push('/pages/members'); // Employee dashboard
            } else {
                router.push('/pages/profile'); // Member profile
            }
        } catch (err: any) {
            console.error("Login error details:", err);
            // Set a more specific error message if available
            setError(err.message || "Invalid email or password");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="card w-full max-w-md">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">Log In to Your Account</h2>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password"
                                    type="password" 
                                    placeholder="Enter your password" 
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="mt-1 text-right">
                                    <Link 
                                        href="/pages/forgot-password" 
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">User Type</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio h-4 w-4 text-blue-600"
                                            name="userType"
                                            value="member"
                                            checked={userType === "member"}
                                            onChange={() => setUserType("member")}
                                        />
                                        <span className="ml-2">Member</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio h-4 w-4 text-blue-600"
                                            name="userType"
                                            value="employee"
                                            checked={userType === "employee"}
                                            onChange={() => setUserType("employee")}
                                        />
                                        <span className="ml-2">Employee/Admin</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button 
                                    className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-5 text-center text-sm text-text-light">
                            Don&apos;t have an account? 
                            <Link href="/pages/signup" className="ml-1 text-primary hover:underline">
                                Sign up now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;