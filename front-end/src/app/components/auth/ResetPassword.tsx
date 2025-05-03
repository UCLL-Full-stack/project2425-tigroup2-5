"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import authService from "../../../../service/authService";
import Header from "../header";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get token from URL
    const token = searchParams?.get("token");
    if (!token) {
      setMessage({ 
        text: "Invalid or missing reset token. Please request a new password reset link.", 
        type: "error" 
      });
    } else {
      setResetToken(token);
    }
  }, [searchParams]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters long", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetToken) {
      setMessage({ text: "Invalid reset token. Please request a new password reset.", type: "error" });
      return;
    }
    
    if (!validatePassword(password)) {
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await authService.resetPassword(resetToken, password);
      
      setResetSuccess(true);
      setMessage({
        text: "Your password has been successfully reset.",
        type: "success"
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/pages/login");
      }, 3000);
      
    } catch (error: unknown) {
      console.error("Error resetting password:", error);
      setMessage({
        text: error instanceof Error ? error.message : "Failed to reset password. The link may have expired.",
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
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            
            {message && (
              <div 
                className={`${
                  message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                } px-4 py-3 rounded mb-4 border`}
              >
                {message.text}
              </div>
            )}
            
            {!resetSuccess ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="form-label">New Password</label>
                  <input 
                    id="password"
                    type="password" 
                    placeholder="Enter your new password" 
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input 
                    id="confirmPassword"
                    type="password" 
                    placeholder="Confirm your new password" 
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    className={`btn btn-primary w-full ${isLoading || !resetToken ? 'opacity-70 cursor-not-allowed' : ''}`} 
                    type="submit"
                    disabled={isLoading || !resetToken}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-4">Password reset successful! Redirecting to login...</div>
                <Link href="/pages/login" className="text-primary hover:underline">
                  Click here if you are not redirected
                </Link>
              </div>
            )}
            
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

export default ResetPassword;