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

        this.validate(Person);

        this.id = Person.id;
        this.firstname = Person.firstname;
        this.surname = Person.surname;
        this.email = Person.email;
        this.phone = Person.phone;
        this.birthDate = Person.birthDate;
    }
    validate(Person: { id: number; firstname: string; surname: string; email: string; phone: string; birthDate: Date; }) {

        if (Person.firstname.length < 2) {
            throw new Error("Invalid firstname");
        }

        if (Person.surname.length < 2) {
            throw new Error("Invalid surname");
        }

        if (!Person.email.includes("@") || !Person.email.includes(".") || Person.email.length < 5 ) {
            throw new Error("Invalid email");
        }

        if (Person.phone.length < 6) {
            throw new Error("Invalid phone");
        }

        if (Person.birthDate > new Date() || Person.birthDate === null) {
            throw new Error("Invalid birth date");
        }
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
    
    public getAge(): number {
        const today = new Date();
        let age = today.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = today.getMonth() - this.birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
            age--;
        }
        return age;
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