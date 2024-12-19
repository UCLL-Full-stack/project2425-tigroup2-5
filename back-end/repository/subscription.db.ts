import database from "../util/database";
import { Subscription } from "../model/subscription";

const getAllSubscriptions = async (): Promise<Subscription[]> => {
    const subscriptionsPrisma = await database.subscription.findMany();
    return subscriptionsPrisma.map((subscriptionPrisma) => Subscription.from(subscriptionPrisma));
}

const getSubscriptionById = async ({ id }: { id: number }): Promise<Subscription | null> => {
    const subscriptionPrisma = await database.subscription.findUnique({
        where: { id }
    });

    return subscriptionPrisma ? Subscription.from(subscriptionPrisma) : null;
}

export default { getAllSubscriptions, getSubscriptionById };