import { Member } from "../model/member";
import { Person } from "../model/person";


test("given valid values, when: member is created, then: member is created with those values", () => {
    const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date("2000-01-01")});

    const member = new Member({id: 1, person: validPerson, enrollments: []});

    expect(member.id).toBe(1);
    expect(member.person).toBe(validPerson);
    expect(member.enrollments).toStrictEqual([]);
});

test("given person is younger than 16, when: member is created, then: throw error", () => {
    const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date("2010-01-01")});

    const member = () => new Member({id: 1, person: validPerson, enrollments: []});

    expect(member).toThrow("Person is younger than 16");
});