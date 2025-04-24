"use client";


import ClubOverview from "@/app/components/clubs/clubOverview";
import Header from "@/app/components/header";
import { Club } from "../../../../types";
import { useEffect, useState } from "react";
import ClubService from "../../../../service/clubService";



const Clubs:React.FC = () => { 

    const [clubs, setClubs] = useState<Club[]>([]);
    
    useEffect(() => {
        getClubs();
    }, []);
    
    const getClubs = async () => {
        const response = await ClubService.getAllClubs();
        const data = await response.json();
        setClubs(data);
    }

    return (
        <>
        <Header></Header>
        <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-gray-700 font-bold mb-2">Clubs</h1>
                    <h2 className="text-lg text-gray-700">These are the clubs</h2>
        <ClubOverview clubs={clubs}></ClubOverview>
        </div>
    </div>
    </>
    )
}

export default Clubs;