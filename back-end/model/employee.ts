import { Employment } from "./employment";
import { Person } from "./person";

export class Employee {
    readonly id?: number;
    readonly employments: Employment[];
    readonly person: Person;
    readonly salary: number;

    constructor(Employee:{
        id: number,
        employments: Employment[],
        person: Person,
        salary: number
    }) {
        this.id = Employee.id;
        this.employments = Employee.employments || [];
        this.person = Employee.person;
        this.salary = Employee.salary;
    }

    equals({id, employments, person, salary}: Employee): boolean {
        return (
            this.id === id &&
            this.employments === employments &&
            this.person.equals(person) &&
            this.salary === salary
        )
    }

    public toString(): string {
        return `Employee [id=${this.id}, club=${this.employments} person=${this.person}, salary=${this.salary}]`;
    }
}