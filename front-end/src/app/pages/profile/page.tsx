"use client";

import Header from "@/app/components/header";
import AuthGuard from "@/app/components/auth/AuthGuard";
import ProfilePage from "@/app/components/profile/profilePage";

const Profile: React.FC = () => {
    return (
        <AuthGuard requiredRoles={['member', 'employee', 'admin']}>
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
        </AuthGuard>
    );
}

export default Profile;