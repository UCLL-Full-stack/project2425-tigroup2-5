import { Person } from "./person";

export class Member {
    readonly id?: number;
    readonly person: Person;

    constructor(member:{
        id: number,
        person: Person
    }) {
        this.id = member.id;
        this.person = member.person;
    }

    equals({id, person}: Member): boolean {
        return this.id === id && this.person.equals(person);
    }

    public toString(): string {
        return `Member [id=${this.id}, person=${this.person}]`;
    }
}