import { Region as RegionPrisma, Club as ClubPrisma, Enrollment as EnrollmentPrisma } from '@prisma/client';
import { Club } from "./club";
import { Enrollment } from "./enrollment";

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

    public static from({
        id,
        name
    } : RegionPrisma ) {
        return new Region({
            id: id,
            name: name
        });
    }

    equals({id, name}: Region): boolean {
        return this.id === id && this.name === name;
    }

    public toString(): string {
        return `Region [id=${this.id}, name=${this.name}]`;
    }
}