import { Person as PersonPrisma } from '@prisma/client';

export class Person {
    readonly id?: number;
    readonly firstname: string;
    readonly surname: string;
    readonly email: string;
    readonly phone: string;
    readonly birthDate: Date;

    constructor(Person:{
        id: number,
        firstname: string,
        surname: string,
        email: string,
        phone: string,
        birthDate: Date,
    }) {
        this.id = Person.id;
        this.firstname = Person.firstname;
        this.surname = Person.surname;
        this.email = Person.email;
        this.phone = Person.phone;
        this.birthDate = Person.birthDate;
    }

    equals({id, firstname, surname, email, phone, birthDate}: Person): boolean {
        return (
            this.id === id &&
            this.firstname === firstname &&
            this.surname === surname &&
            this.email === email &&
            this.phone === phone &&
            this.birthDate === birthDate
        )
    }

    static from ({
        id,
        firstName,
        lastName,
        email,
        phone,
        birthDate,
    } : PersonPrisma ) {
        return new Person({
            id: id,
            firstname: firstName,
            surname: lastName,
            email: email,
            phone: phone,
            birthDate: birthDate,
        });
    }

    public toString(): string {
        return `Person [id=${this.id}, firstname=${this.firstname}, surname=${this.surname}, email=${this.email}, phone=${this.phone}, birthDate=${this.birthDate}]`;
    }

}