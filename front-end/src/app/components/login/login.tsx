import Header from "../header";
import Link from "next/link";

const LoginScreen = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="card w-full max-w-md">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">Log In to Your Account</h2>
                        
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="username" className="form-label">Username</label>
                                <input 
                                    id="username"
                                    type="text" 
                                    placeholder="Enter your username" 
                                    className="form-input"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    id="password"
                                    type="password" 
                                    placeholder="Enter your password" 
                                    className="form-input" 
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button className="btn btn-primary w-full" type="submit">
                                    Log In
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-5 text-center text-sm text-text-light">
                            Don't have an account? 
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