export class Person {
    private nrn!: string;
    private firstname!: string;
    private surname!: string;
    private email!: string;
    private phone!: string;
    private birthDate!: Date;

    constructor (nrn: string, firstname: string, surname: string, email: string, phone: string, birthDate: Date) {
        this.setNrn(nrn);
        this.setFirstname(firstname);
        this.setSurname(surname);
        this.setEmail(email);
        this.setPhone(phone);
        this.setBirthDate(birthDate);
    }
        
    public getNrn(): string {
        return this.nrn;
    }

    public getFirstname(): string {
        return this.firstname;
    }

    public getSurname(): string {
        return this.surname;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPhone(): string {
        return this.phone;
    }

    public getBirthDate(): Date {
        return this.birthDate;
    }

    public setNrn(nrn: string): void {
        this.nrn = nrn;
    }

    public setFirstname(firstname: string): void {
        this.firstname = firstname;
    }

    public setSurname(surname: string): void {
        this.surname = surname;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPhone(phone: string): void {
        this.phone = phone;
    }

    public setBirthDate(birthDate: Date): void {
        this.birthDate = birthDate;
    }

    public toString(): string {
        return `Person [nrn=${this.nrn}, firstname=${this.firstname}, surname=${this.surname}, email=${this.email}, phone=${this.phone}, birthDate=${this.birthDate}]`;
    }

}