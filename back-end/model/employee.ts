import { Person } from "./person";
import { Club } from "./club";

export class Employee {
    private id!: number;
    private club?: Club;
    private person!: Person;
    private salary!: number;

    constructor(id: number, club: Club, person: Person, salary: number) {
        this.setId(id);
        this.setClub(club);
        this.setPerson(person);
        this.setSalary(salary);
    }

    public getId(): number {
        return this.id;
    }

    public getClub(): Club | undefined {
        return this.club;
    }

    public getPerson(): Person {
        return this.person;
    }

    public getSalary(): number {
        return this.salary;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setClub(club: Club): void {
        this.club = club;
    }

    public setPerson(person: Person): void {
        this.person = person;
    }

    public setSalary(salary: number): void {
        this.salary = salary;
    }

    public toString(): string {
        return `Employee [id=${this.id}, club=${this.club} person=${this.person}, salary=${this.salary}]`;
    }
}