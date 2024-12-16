import { Member } from "../model/member";
import { Person } from "../model/person";

const validPerson = new Person("1", "John", "Doe", "john.doe@email.com", "123456789", new Date());

test("given valid values, when: member is created, then: member is created with those values", () => {
    const member = new Member(1, validPerson);

    expect(member.getId()).toBe(1);
    expect(member.getPerson()).toBe(validPerson);
});