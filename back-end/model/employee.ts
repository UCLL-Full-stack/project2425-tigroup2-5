import { Employee as EmployeePrisma, Person as PersonPrisma } from "@prisma/client";
import { EmployeeInput } from "../types";
import { Employment } from "./employment";
import { Person } from "./person";

export class Employee {
    readonly id?: number;
    readonly admin: boolean;
    readonly title: string;
    readonly person: Person;
    readonly salary: number;
    readonly password: string;

    constructor(Employee:{
        id: number,
        admin: boolean,
        title: string,
        person: Person,
        salary: number,
        password: string
    }) {
        this.id = Employee.id;
        this.admin = Employee.admin;
        this.title = Employee.title;
        this.person = Employee.person;
        this.salary = Employee.salary;
        this.password = Employee.password;
    }
    
    equals({id, person, salary}: Employee): boolean {
        return (
            this.id === id &&
            this.person.equals(person) &&
            this.salary === salary
        )
    }
    
    public static from({
        id,
        admin,
        title,
        person,
        salary,
        password
    } : EmployeePrisma & {person: PersonPrisma} ) {
        return new Employee({
            id: id,
            admin: admin,
            title: title,
            person: Person.from(person),
            salary: salary,
            password: password
        });
    }
}