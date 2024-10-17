export class Subscription {
    private id!: number;
    private type!: string;
    private price!: number;

    constructor(id: number, type: string, price: number) {
        this.setId(id);
        this.setType(type);
        this.setPrice(price);
    }

    public getId(): number {
        return this.id;
    }

    public getType(): string {
        return this.type;
    }

    public getPrice(): number {
        return this.price;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setPrice(price: number): void {
        this.price = price;
    }

    public toString(): string {
        return `Subscription [id=${this.id}, type=${this.type}, price=${this.price}]`;
    }
}