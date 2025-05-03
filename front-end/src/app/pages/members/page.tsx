"use client";

import Header from "@/app/components/header";
import { useEffect, useState } from "react";
import memberService from "@/../service/memberService";
import MembersPage from "@/app/components/members/membersPage";
import { Member } from "@/../types";

const MemberOverview: React.FC = () => {
    
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        getMembers();
    }, []);
    
    const getMembers = async () => {
        setLoading(true);
        try {
            // memberService already returns the parsed JSON data
            const members = await memberService.getAllMembers();
            setMembers(members);
        } catch (error) {
            console.error("Failed to fetch members:", error);
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
                                <h1 className="text-2xl font-bold">Members</h1>
                                <p className="text-text-light">Manage and view all gym members</p>
                            </header>
                            
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-pulse text-primary">Loading members...</div>
                                </div>
                            ) : (
                                <MembersPage members={members} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MemberOverview;