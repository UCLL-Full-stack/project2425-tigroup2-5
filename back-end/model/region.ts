export class Region {
    readonly id?: number;
    readonly name: string;

    constructor(Region:{
        id: number,
        name: string
    }) {
        this.id = Region.id;
        this.name = Region.name;
    }

    equals({id, name}: Region): boolean {
        return this.id === id && this.name === name;
    }

    public toString(): string {
        return `Region [id=${this.id}, name=${this.name}]`;
    }
}