import { Subscription } from "../model/subscription";

test("given valid values, when: subscription is created, then: subscription is created with those values", () => {
    
    const subscription = new Subscription(1, "Standard", 100);

    expect(subscription.getId()).toBe(1);
    expect(subscription.getType()).toBe("Standard");
    expect(subscription.getPrice()).toBe(100);

});