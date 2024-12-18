import { Enrollment } from "./enrollment";

export class Subscription {
    readonly id?: number;
    readonly type: string;
    readonly price: number;
    readonly Enrollments: Enrollment[];

    constructor(subscription: {
        id: number,
        type: string,
        price: number,
        Enrollments: Enrollment[]
    }) {
        this.id = subscription.id;
        this.type = subscription.type;
        this.price = subscription.price;
        this.Enrollments = subscription.Enrollments || [];
    }

    equals({id, type, price, Enrollments}: Subscription): boolean {
        return (
            this.id === id &&
            this.type === type &&
            this.price === price &&
            this.Enrollments === Enrollments
        )
    }

    public toString(): string {
        return `Subscription [id=${this.id}, type=${this.type}, price=${this.price}]`;
    }
}