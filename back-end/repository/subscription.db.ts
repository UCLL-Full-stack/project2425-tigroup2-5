import { Subscription } from "../model/subscription";
import { SubscriptionInput } from "../types";

let currentId = 1;

const subscriptions: Subscription[] = [
    new Subscription({id: currentId++, type: "Standard", price: 100}),
    new Subscription({id: currentId++, type: "Premium", price: 200}),
    new Subscription({id: currentId++, type: "VIP", price: 300}),
];

const createSubscription = ({type: type, price: price}:SubscriptionInput): Subscription => {
    const subscription = new Subscription({id: currentId++, type, price});
    subscriptions.push(subscription);
    return subscription;
}

const getAllSubscriptions = (): Subscription[] => subscriptions;

const getSubscriptionById = (id: number): Subscription | undefined => subscriptions.find((subscription) => subscription.id === id);

export default { createSubscription, getAllSubscriptions, getSubscriptionById };