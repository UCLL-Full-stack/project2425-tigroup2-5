export class Region {
    private id!: number;
    private name!: string;

    constructor(id: number, name: string) {
        this.setId(id);
        this.setName(name);
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public toString(): string {
        return `Region [id=${this.id}, name=${this.name}]`;
    }
}