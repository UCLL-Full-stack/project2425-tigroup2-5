import { Employment } from './employment';
import { Enrollment } from './enrollment';
import { Region } from './region';

export class Club {
    readonly id?: number;
    readonly address: string;
    readonly region: Region;
    readonly employments: Employment[];
    readonly enrollments: Enrollment[];

    constructor(club: {
        id?: number;
        address: string;
        region: Region;
        employments: Employment[];
        enrollments: Enrollment[];
    }) {
        this.validate(club);
        
        this.id = club.id;
        this.address = club.address;
        this.employments = club.employments || [];
        this.enrollments = club.enrollments || [];
        this.region = club.region;
        club.region.clubs.push(this);
    }
    
    validate(club: { id?: number; address: string; region: Region; employments: Employment[]; enrollments: Enrollment[]; }) {
        throw new Error('Method not implemented.');
    }

    equals({ id, address, region }: Club): boolean {
        return this.id === id && this.address === address && this.region.equals(region);
    }
    

    public toString(): string {
        return `Club [id=${this.id}, address=${this.address}]`;
    }
}
