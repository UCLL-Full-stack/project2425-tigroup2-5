export class Person {
    readonly nrn?: string;
    readonly firstname: string;
    readonly surname: string;
    readonly email: string;
    readonly phone: string;
    readonly birthDate: Date;

    constructor(Person:{
        nrn: string,
        firstname: string,
        surname: string,
        email: string,
        phone: string,
        birthDate: Date
    }) {
        this.nrn = Person.nrn;
        this.firstname = Person.firstname;
        this.surname = Person.surname;
        this.email = Person.email;
        this.phone = Person.phone;
        this.birthDate = Person.birthDate;
    }

    equals({nrn, firstname, surname, email, phone, birthDate}: Person): boolean {
        return (
            this.nrn === nrn &&
            this.firstname === firstname &&
            this.surname === surname &&
            this.email === email &&
            this.phone === phone &&
            this.birthDate === birthDate
        )
    }


    public toString(): string {
        return `Person [nrn=${this.nrn}, firstname=${this.firstname}, surname=${this.surname}, email=${this.email}, phone=${this.phone}, birthDate=${this.birthDate}]`;
    }

}