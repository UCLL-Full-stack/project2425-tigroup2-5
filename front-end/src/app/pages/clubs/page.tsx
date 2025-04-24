"use client";

import ClubOverview from "@/app/components/clubs/clubOverview";
import Header from "@/app/components/header";
import { Club } from "../../../../types";
import { useEffect, useState } from "react";
import ClubService from "../../../../service/clubService";

const Clubs:React.FC = () => { 
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        getClubs();
    }, []);
    
    const getClubs = async () => {
        setLoading(true);
        try {
            const response = await ClubService.getAllClubs();
            const data = await response.json();
            setClubs(data);
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="card">
                        <div className="p-6">
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold">Clubs</h1>
                                <p className="text-text-light">View and manage gym locations</p>
                            </header>
                            
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-pulse text-primary">Loading clubs...</div>
                                </div>
                            ) : (
                                <ClubOverview clubs={clubs} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Clubs;