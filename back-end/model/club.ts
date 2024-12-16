import { Region } from './region';

export class Club {
    readonly id?: number;
    readonly region: Region;
    readonly address: string;

    constructor(club: {
        id: number,
        region:Region,
        address: string
    }) {
        this.id = club.id;
        this.region = club.region;
        this.address = club.address;
    }

    equals({id, region, address}: Club): boolean {
        return (
            this.id === id &&
            this.region.equals(region) &&
            this.address === address
        )
    }

    public toString(): string {
        return `Club [id=${this.id}, region=${this.region}, address=${this.address}]`;
    }
}
