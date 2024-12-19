import { Club as ClubPrisma, Region as RegionPrisma } from '@prisma/client';
import { Region } from './region';

export class Club {
    readonly id?: number;
    readonly address: string;
    readonly region: Region;

    constructor(club: {
        id?: number;
        address: string;
        region: Region;
    }) {
        this.validate(club);
        
        this.id = club.id;
        this.address = club.address;
        this.region = club.region;
    }
    
    validate(club: { id?: number; address: string; region: Region; }) {
        //throw new Error('Method not implemented.');
    }

    public static from({
        id,
        address,
        region
    }: ClubPrisma & { region: RegionPrisma }) {   
        return new Club({
            id: id,
            address: address,
            region: Region.from(region),
        });
    }

    equals({ id, address }: Club): boolean {
        return this.id === id && this.address === address;
    }
    

    public toString(): string {
        return `Club [id=${this.id}, address=${this.address}]`;
    }
}
