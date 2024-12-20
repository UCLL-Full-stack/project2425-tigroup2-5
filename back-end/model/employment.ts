import { Employment as EmploymentPrisma, Employee as EmployeePrisma, Club as ClubPrisma, Region as RegionPrisma, Person as PersonPrisma } from "@prisma/client";
import { Club } from "./club";
import { Employee } from "./employee";

export class Employment {
    readonly id?: number;
    readonly startDate: Date;
    readonly endDate?: Date | null;
    readonly employee: Employee;
    readonly club: Club;

    constructor(Employment:{
        id: number,
        employee: Employee,
        club: Club
        startDate: Date,
    }) {
        this.id = Employment.id;
        this.startDate = Employment.startDate;
        this.endDate = null;
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

    static from({
        id,
        startDate,
        employee,
        club
    } : EmploymentPrisma & {
        employee: EmployeePrisma & {person: PersonPrisma},
        club: ClubPrisma & {region: RegionPrisma}
    }) {
        return new Employment({
            id: id,
            startDate: startDate,
            employee: Employee.from(employee),
            club: Club.from(club)
        });
    }

    public toString(): string {
        return `Employment [id=${this.id}, startDate=${this.startDate}, endDate=${this.endDate}, employee=${this.employee}, club=${this.club}]`;
    }
}