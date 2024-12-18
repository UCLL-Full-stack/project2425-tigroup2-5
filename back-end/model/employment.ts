import { Club } from "./club";
import { Employee } from "./employee";

export class Employment {
    readonly id?: number;
    readonly startDate: Date;
    readonly endDate?: Date;
    readonly employee: Employee;
    readonly club: Club;

    constructor(Employment:{
        id: number,
        startDate: Date,
        salary: number,
        employee: Employee,
        club: Club
    }) {
        this.id = Employment.id;
        this.startDate = Employment.startDate;
        this.endDate = undefined;
        this.employee = Employment.employee;
        this.club = Employment.club;
    }

    equals({id, startDate, endDate, employee, club}: Employment): boolean {
        return (
            this.id === id &&
            this.startDate === startDate &&
            this.endDate === endDate &&
            this.employee.equals(employee) &&
            this.club.equals(club)
        )
    }

    public toString(): string {
        return `Employment [id=${this.id}, startDate=${this.startDate}, endDate=${this.endDate}, employee=${this.employee}, club=${this.club}]`;
    }
}