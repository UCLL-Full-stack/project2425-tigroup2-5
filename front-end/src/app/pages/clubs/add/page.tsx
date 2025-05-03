"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import clubService from "../../../../../service/clubService";
import regionService from "../../../../../service/regionService";

interface Region {
    id: number;
    name: string;
}

const AddClub = () => {
    const [address, setAddress] = useState("");
    const [regionId, setRegionId] = useState<string>("");
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch regions for dropdown
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await regionService.getAllRegions();
                const data = await response.json();
                setRegions(data);
            } catch (error) {
                console.error("Error fetching regions:", error);
                setError("Failed to load regions. Please try again later.");
            }
        };

        fetchRegions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!address) {
            setError("Address is required");
            return;
        }

        if (!regionId) {
            setError("Region is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await clubService.createClub({
                address,
                regionId: parseInt(regionId)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create club");
            }

            // Redirect back to clubs list
            router.push("/pages/clubs");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to create club. Please try again.");
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
                                <h1 className="text-2xl font-bold">Add New Club</h1>
                                <p className="text-text-light">Create a new gym location</p>
                            </header>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="address" className="form-label">
                                        Address
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        className="form-input"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter club address"
                                        required
                                    />
                                </div>
                                
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
                                        {loading ? "Creating..." : "Create Club"}
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

export default AddClub;