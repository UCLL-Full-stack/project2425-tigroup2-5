import Header from "@/app/components/header";
import SubscriptionOverview from "@/app/components/subscription/subscriptionOverview";
import type { Subscription } from "../../../../types";
import { useEffect, useState } from "react";
import SubscriptionService from "../../../../service/subscriptionService";

export default function Subscription() {

        
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
            <SubscriptionOverview subscription={subscriptions}></SubscriptionOverview>
        </div>
    );
}