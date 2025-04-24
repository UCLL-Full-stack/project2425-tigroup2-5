"use client";

import Header from "@/app/components/header";
import ProfilePage from "@/app/components/profile/profilePage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Profile: React.FC = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem("user");
        if (!user) {
            // Redirect to login page if not logged in
            router.push("/pages/login");
        } else {
            setIsLoggedIn(true);
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-pulse text-primary">Loading...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null; // Will redirect in the useEffect, this prevents flash of content
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="card">
                        <div className="p-6">
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold">My Profile</h1>
                                <p className="text-text-light">View and manage your personal information</p>
                            </header>
                            
                            <ProfilePage />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;