import { Club as ClubPrisma } from '@prisma/client';

export class Club {
    readonly id?: number;
    readonly address: string;
    readonly regionId: number;

    constructor(club: {
        id?: number;
        address: string;
        regionId: number;
    }) {
        this.id = club.id;
        this.address = club.address;
        this.regionId = club.regionId;
    }

    public static from({
        id,
        address,
        regionId
    }: ClubPrisma) {
        return new Club({
            id: id,
            address: address,
            regionId: regionId,
        });
    }

    equals({ id, address }: Club): boolean {
        return this.id === id && this.address === address;
    }
    

    public toString(): string {
        return `Club [id=${this.id}, address=${this.address}]`;
    }
}
