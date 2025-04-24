"use client";

import Header from "@/app/components/header";
import { useEffect, useState } from "react";
import memberService from "@/../service/memberService";
import MembersPage from "@/app/components/members/membersPage";
import { Member } from "@/../types";

const MemberOverview: React.FC = () => {
    
    const [members, setMembers] = useState<Member[]>([]);
    
    useEffect(() => {
        getMembers();
    }, []);
    
    const getMembers = async () => {
        const response = await memberService.getAllMembers();
        const data = await response.json();
        setMembers(data);
    }
    
    return (
        <>
            <Header></Header>
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-gray-700 font-bold mb-2">Members</h1>
                    <h2 className="text-lg text-gray-700">These are the members</h2>
                    <MembersPage members={members}></MembersPage>
                </div>
            </div>
        </>
    );
}

export default MemberOverview;