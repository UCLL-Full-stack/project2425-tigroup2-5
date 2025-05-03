"use client";

import { useState } from "react";
import Link from "next/link";
import authService from "../../../../service/authService";
import Header from "../header";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"member" | "employee">("member");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await authService.requestPasswordReset(email, userType);
      
      // Always show success message, even if email doesn't exist (for security)
      setMessage({
        text: "If an account exists with this email, we've sent password reset instructions.",
        type: "success"
      });
      
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setMessage({
        text: "Something went wrong. Please try again later.",
        type: "error"
      });
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
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            
            {message && (
              <div 
                className={`${
                  message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                } px-4 py-3 rounded mb-4 border`}
              >
                {message.text}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email address" 
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Account Type</label>
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
                  className={`btn btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>
            
            <div className="mt-5 text-center text-sm text-text-light">
              <Link href="/pages/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;