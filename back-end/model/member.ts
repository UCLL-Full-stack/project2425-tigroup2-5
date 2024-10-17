import { Person } from "./person";

export class Member {
    private id!: number;
    private person!: Person;

    constructor(id: number, person: Person) {
        this.setId(id);
        this.setPerson(person);
    }

    public getId(): number {
        return this.id;
    }

    public getPerson(): Person {
        return this.person;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setPerson(person: Person): void {
        this.person = person;
    }

    public toString(): string {
        return `Member [id=${this.id}, person=${this.person}]`;
    }
}