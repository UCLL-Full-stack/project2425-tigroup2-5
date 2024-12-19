import { Member as MemberPrisma, Person as PersonPrisma } from "@prisma/client";
import { Person } from "./person";

export class Member {
    readonly id?: number;
    readonly person: Person;

    constructor(member:{
        id: number,
        person: Person,
    }) {
        this.id = member.id;
        this.person = member.person;
    }

    public static from({
        id,
        person
    } : MemberPrisma & {person: PersonPrisma} ) {
        return new Member({
            id: id,
            person: Person.from(person),
        });
    }

    equals({id, person}: Member): boolean {
        return this.id === id && this.person.equals(person);
    }

    public toString(): string {
        return `Member [id=${this.id}, person=${this.person}]`;
    }
}