import { Member } from "../model/member";
import { Person } from "../model/person";

const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date()});

test("given valid values, when: member is created, then: member is created with those values", () => {
    const member = new Member({id: 1, person: validPerson, enrollments: []});

    expect(member.id).toBe(1);
    expect(member.person).toBe(validPerson);
    expect(member.enrollments).toStrictEqual([]);
});