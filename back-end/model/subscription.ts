export class Subscription {
    readonly id?: number;
    readonly type: string;
    readonly price: number;

    constructor(subscription: {
        id: number,
        type: string,
        price: number
    }) {
        this.id = subscription.id;
        this.type = subscription.type;
        this.price = subscription.price;
    }

    equals({id, type, price}: Subscription): boolean {
        return (
            this.id === id &&
            this.type === type &&
            this.price === price
        )
    }

    public toString(): string {
        return `Subscription [id=${this.id}, type=${this.type}, price=${this.price}]`;
    }
}