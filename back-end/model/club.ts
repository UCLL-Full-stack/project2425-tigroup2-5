import { Employment } from './employment';
import { Enrollment } from './enrollment';
import { Region } from './region';

export class Club {
    readonly id?: number;
    readonly address: string;
    readonly region: Region;
    readonly employments: Employment[];

    constructor(club: {
        id?: number;
        address: string;
        employments: Employment[];
        region: Region;
    }) {
        this.id = club.id;
        this.address = club.address;
        this.employments = club.employments || [];
        this.region = club.region;
    }

    

    public toString(): string {
        return `Club [id=${this.id}, address=${this.address}]`;
    }
}
