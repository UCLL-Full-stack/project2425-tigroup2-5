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
        birthDate: Date,
    }) {

        this.validate(Person);

        this.nrn = Person.nrn;
        this.firstname = Person.firstname;
        this.surname = Person.surname;
        this.email = Person.email;
        this.phone = Person.phone;
        this.birthDate = Person.birthDate;
    }
    validate(Person: { nrn: string; firstname: string; surname: string; email: string; phone: string; birthDate: Date; }) {
        if (Person.nrn.length !== 13 || Person.nrn.match(/^[0-9]+$/) === null) {
            throw new Error("Invalid nrn");
        }

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
    
    public getAge(): number {
        const today = new Date();
        let age = today.getFullYear() - this.birthDate.getFullYear();
        const monthDiff = today.getMonth() - this.birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
            age--;
        }
        return age;
    }

    public toString(): string {
        return `Person [nrn=${this.nrn}, firstname=${this.firstname}, surname=${this.surname}, email=${this.email}, phone=${this.phone}, birthDate=${this.birthDate}]`;
    }

}