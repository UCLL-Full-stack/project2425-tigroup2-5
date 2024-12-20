import { Member as MemberPrisma, Person as PersonPrisma } from "@prisma/client";
import { Person } from "./person";

export class Member {
    readonly id?: number;
    readonly password: string;
    readonly person: Person;

    constructor(member:{
        id: number,
        password: string,
        person: Person,
    }) {
        this.validate(member);

        this.id = member.id;
        this.password = member.password;
        this.person = member.person;
    }

    public static from({
        id,
        person
    } : MemberPrisma & {person: PersonPrisma} ) {
        return new Member({
            id: id,
            password: person.email,
            person: Person.from(person),
        });
    }

    validate(member: { id: number; person: Person; }) {
        if (member.person.getAge() < 16) {
            throw new Error("Person is younger than 16");
        }

        if (this.password.length < 6) {
            throw new Error("Password is too short");
        }
    }

    equals({id, person}: Member): boolean {
        return this.id === id && this.person.equals(person);
    }

    public toString(): string {
        return `Member [id=${this.id}, person=${this.person}]`;
    }
}