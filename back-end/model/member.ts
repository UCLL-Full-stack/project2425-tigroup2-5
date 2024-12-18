import { Enrollment } from "./enrollment";
import { Person } from "./person";

export class Member {
    readonly id?: number;
    readonly person: Person;
    readonly enrollments: Enrollment[];

    constructor(member:{
        id: number,
        person: Person,
        enrollments: Enrollment[]
    }) {
        this.validate(member);

        this.id = member.id;
        this.person = member.person;
        this.enrollments = member.enrollments || [];
    }

    validate(member: { id: number; person: Person; enrollments: Enrollment[]; }) {
        if (member.person.getAge() < 16) {
            throw new Error("Person is younger than 16");
        }
    }

    equals({id, person}: Member): boolean {
        return this.id === id && this.person.equals(person);
    }

    public toString(): string {
        return `Member [id=${this.id}, person=${this.person}]`;
    }
}