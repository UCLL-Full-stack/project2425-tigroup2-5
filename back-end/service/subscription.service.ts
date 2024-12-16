import subscriptionDb from "../repository/subscription.db";
import { Subscription } from "../model/subscription";
import { subscriptionInput } from "../types";

const getAllSubscriptions = async(): Promise<Subscription[]> => subscriptionDb.getAllSubscriptions();

const getSubscriptionById = async(id: number): Promise<Subscription> => {
    const subscription = await subscriptionDb.getSubscriptionById(id);
    if(subscription === undefined) throw new Error(`Subscription with id ${id} not found`);
    return subscription;
};

const createSubscription = async(subscription: subscriptionInput): Promise<Subscription> => {
    return subscriptionDb.createSubscription(subscription);
}

export default { getAllSubscriptions, getSubscriptionById, createSubscription };