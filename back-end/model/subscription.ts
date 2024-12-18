import { Enrollment } from "./enrollment";

export class Subscription {
    readonly id?: number;
    readonly type: string;
    readonly price: number;
    readonly enrollments: Enrollment[];

    constructor(subscription: {
        id: number,
        type: string,
        price: number,
        enrollments: Enrollment[]
    }) {
        this.id = subscription.id;
        this.type = subscription.type;
        this.price = subscription.price;
        this.enrollments = subscription.enrollments || [];
    }

    equals({id, type, price, enrollments}: Subscription): boolean {
        return (
            this.id === id &&
            this.type === type &&
            this.price === price &&
            this.enrollments === enrollments
        )
    }

    public toString(): string {
        return `Subscription [id=${this.id}, type=${this.type}, price=${this.price}]`;
    }
}