import { Employee } from "../model/employee"
import { Club } from "../model/club"
import { Region } from "../model/region"
import { Person } from "../model/person"
import { Employment } from "../model/employment";


const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')});

test("given valid values, when: employee is created, then: employee is created with those values", () => {
    const employee = new Employee({id: 1, person: validPerson, salary: 1000, employments: []});

    expect(employee.id).toBe(1);
    expect(employee.employments).toStrictEqual([]);
    expect(employee.person).toBe(validPerson);
    expect(employee.salary).toBe(1000);
})