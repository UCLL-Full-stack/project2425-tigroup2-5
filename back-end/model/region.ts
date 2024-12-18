import { Club } from "./club";
import { Enrollment } from "./enrollment";

export class Region {
    readonly id?: number;
    readonly name: string;
    readonly clubs: Club[];
    readonly enrollments: Enrollment[] = [];

    constructor(Region:{
        id: number,
        name: string,
        clubs: Club[],
    }) {
        this.id = Region.id;
        this.name = Region.name;
        this.clubs = Region.clubs || [];
    }

    equals({id, name}: Region): boolean {
        return this.id === id && this.name === name;
    }

    public toString(): string {
        return `Region [id=${this.id}, name=${this.name}]`;
    }
}