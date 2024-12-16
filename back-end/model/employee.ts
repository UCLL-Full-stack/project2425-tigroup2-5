import { Person } from "./person";
import { Club } from "./club";

export class Employee {
    readonly id?: number;
    readonly club?: Club;
    readonly person: Person;
    readonly salary: number;

    constructor(Employee:{
        id: number,
        club: Club,
        person: Person,
        salary: number
    }) {
        this.id = Employee.id;
        this.club = Employee.club;
        this.person = Employee.person;
        this.salary = Employee.salary;
    }

    equals({id, club, person, salary}: Employee): boolean {
        return (
            this.id === id &&
            this.person.equals(person) &&
            this.salary === salary
        )
    }

    public toString(): string {
        return `Employee [id=${this.id}, club=${this.club} person=${this.person}, salary=${this.salary}]`;
    }
}