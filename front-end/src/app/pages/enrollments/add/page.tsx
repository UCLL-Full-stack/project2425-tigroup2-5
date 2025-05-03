"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import enrollmentService from "../../../../../service/enrollmentService";
import memberService from "../../../../../service/memberService";
import subscriptionService from "../../../../../service/subscriptionService";
import clubService from "../../../../../service/clubService";
import regionService from "../../../../../service/regionService";

interface Member {
    id: number;
    person: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface Subscription {
    id: number;
    type: string;
    price: number;
}

interface Club {
    id: number;
    address: string;
}

interface Region {
    id: number;
    name: string;
}

const AddEnrollment = () => {
    const [memberId, setMemberId] = useState<string>("");
    const [subscriptionId, setSubscriptionId] = useState<string>("");
    const [subscriptionType, setSubscriptionType] = useState<string>("");
    const [clubId, setClubId] = useState<string>("");
    const [regionId, setRegionId] = useState<string>("");
    const [enrollmentDate, setEnrollmentDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [expirationDate, setExpirationDate] = useState<string>(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split("T")[0]
    );

    const [members, setMembers] = useState<Member[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch necessary data for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch members
                const membersData = (await memberService.getAllMembers()) as Member[];
                setMembers(
                    membersData.map((member) => ({
                        id: member.id ?? 0, // Ensure id is a number
                        person: member.person,
                    }))
                );

                const subscriptionsResponse = await subscriptionService.getAllSubscriptions();
                const subscriptionsData = await subscriptionsResponse.json();
                setSubscriptions(subscriptionsData);

                const clubsResponse = await clubService.getAllClubs();
                const clubsData = await clubsResponse.json();
                setClubs(clubsData);

                const regionsResponse = await regionService.getAllRegions();
                const regionsData = await regionsResponse.json();
                setRegions(regionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load necessary data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const handleSubscriptionChange = (id: string) => {
        setSubscriptionId(id);
        const selectedSubscription = subscriptions.find(sub => sub.id === parseInt(id));
        setSubscriptionType(selectedSubscription?.type || "");

        if (selectedSubscription?.type === "Club") {
            setRegionId("");
        } else if (selectedSubscription?.type === "Regional") {
            setClubId("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!memberId || !subscriptionId || !enrollmentDate || !expirationDate) {
            setError("Member, subscription, and dates are required");
            return;
        }

        if (subscriptionType === "Club" && !clubId) {
            setError("Please select a club for the Club subscription");
            return;
        }

        if (subscriptionType === "Regional" && !regionId) {
            setError("Please select a region for the Regional subscription");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const enrollmentData: {
                memberId: number;
                subscriptionId: number;
                enrollmentDate: Date;
                expirationDate: Date;
                clubId?: number;
                regionId?: number;
            } = {
                memberId: parseInt(memberId),
                subscriptionId: parseInt(subscriptionId),
                enrollmentDate: new Date(enrollmentDate),
                expirationDate: new Date(expirationDate)
            };

            if (subscriptionType === "Club" && clubId) {
                enrollmentData.clubId = parseInt(clubId);
            }

            if (subscriptionType === "Regional" && regionId) {
                enrollmentData.regionId = parseInt(regionId);
            }

            const response = await enrollmentService.createEnrollment(enrollmentData);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create enrollment");
            }

            router.push("/pages/enrollments");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to create enrollment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <div className="p-6">
                            <header className="mb-6">
                                <h1 className="text-2xl font-bold">Add New Enrollment</h1>
                                <p className="text-text-light">Create a new member subscription enrollment</p>
                            </header>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="member" className="form-label">
                                        Member
                                    </label>
                                    <select
                                        id="member"
                                        className="form-select"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a member</option>
                                        {members.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.person.firstName} {member.person.lastName} ({member.person.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="subscription" className="form-label">
                                        Subscription
                                    </label>
                                    <select
                                        id="subscription"
                                        className="form-select"
                                        value={subscriptionId}
                                        onChange={(e) => handleSubscriptionChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a subscription</option>
                                        {subscriptions.map((subscription) => (
                                            <option key={subscription.id} value={subscription.id}>
                                                {subscription.type} - €{subscription.price.toFixed(2)}/month
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {subscriptionType === "Club" && (
                                    <div>
                                        <label htmlFor="club" className="form-label">
                                            Club
                                        </label>
                                        <select
                                            id="club"
                                            className="form-select"
                                            value={clubId}
                                            onChange={(e) => setClubId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a club</option>
                                            {clubs.map((club) => (
                                                <option key={club.id} value={club.id}>
                                                    {club.address}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                {subscriptionType === "Regional" && (
                                    <div>
                                        <label htmlFor="region" className="form-label">
                                            Region
                                        </label>
                                        <select
                                            id="region"
                                            className="form-select"
                                            value={regionId}
                                            onChange={(e) => setRegionId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a region</option>
                                            {regions.map((region) => (
                                                <option key={region.id} value={region.id}>
                                                    {region.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="enrollmentDate" className="form-label">
                                            Start Date
                                        </label>
                                        <input
                                            id="enrollmentDate"
                                            type="date"
                                            className="form-input"
                                            value={enrollmentDate}
                                            onChange={(e) => setEnrollmentDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="expirationDate" className="form-label">
                                            Expiration Date
                                        </label>
                                        <input
                                            id="expirationDate"
                                            type="date"
                                            className="form-input"
                                            value={expirationDate}
                                            onChange={(e) => setExpirationDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-between pt-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Enrollment"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddEnrollment;