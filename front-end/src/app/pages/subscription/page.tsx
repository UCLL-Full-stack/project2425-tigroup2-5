"use client";

import SubscriptionOverview from "@/app/components/subscription/subscriptionOverview";
import { Subscription } from "../../../../types";
import { useEffect, useState } from "react";
import SubscriptionService from "../../../../service/subscriptionService";
import Header from "@/app/components/header";

export default function SubscriptionPage() {

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    
    useEffect(() => {
        getSubscriptions();
    }, []);
    
    const getSubscriptions = async () => {
        const response = await SubscriptionService.getAllSubscriptions();
        const data = await response.json();
        setSubscriptions(data);
    }
    return (
        <div>
            <Header></Header>
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-gray-700 font-bold mb-2">Subscriptions</h1>
                    <h2 className="text-lg text-gray-700">These are the subscriptions</h2>
            <SubscriptionOverview subscription={subscriptions}></SubscriptionOverview>
            </div>
        </div>
        </div>
    );
}
