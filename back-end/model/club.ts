import { Region } from './region';

export class Club {
    private id!: number;
    private region!: Region;
    private address!: string;

    constructor(id: number, region:Region, address: string) {
        this.setId(id);
        this.setRegion(region);
        this.setAddress(address);
    }

    public getId(): number {
        return this.id;
    }

    public getRegion(): Region {
        return this.region;
    }

    public getAddress(): string {
        return this.address;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setRegion(region: Region): void {
        this.region = region;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public toString(): string {
        return `Club [id=${this.id}, region=${this.region}, address=${this.address}]`;
    }
}
