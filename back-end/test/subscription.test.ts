import { Subscription } from "../model/subscription";

test("given valid values, when: subscription is created, then: subscription is created with those values", () => {
    
    const subscription = new Subscription({id:1, type: "Standard", price: 100});

    expect(subscription.id).toBe(1);
    expect(subscription.type).toBe("Standard");
    expect(subscription.price).toBe(100);
});