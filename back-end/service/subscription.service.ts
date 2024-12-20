import subscriptionDb from "../repository/subscription.db";
import { Subscription } from "../model/subscription";
import { SubscriptionInput } from "../types";

const getAllSubscriptions = async(): Promise<Subscription[]> => subscriptionDb.getAllSubscriptions();

const getSubscriptionById = async(id: number): Promise<Subscription> => {
    const subscription = await subscriptionDb.getSubscriptionById({id});
    if(subscription === null) throw new Error(`Subscription with id ${id} not found`);
    return subscription;
};

export default { getAllSubscriptions, getSubscriptionById };