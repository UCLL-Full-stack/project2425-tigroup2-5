import { Person } from "../model/person";

const validDate = new Date();

test("given valid values, when: person is created, then: person is created with those values", () => {
    
    const validPerson = new Person("1", "John", "Doe", "john.doe@email.com", "123456789", validDate);

    expect(validPerson.getNrn()).toBe("1");
    expect(validPerson.getFirstname()).toBe("John");
    expect(validPerson.getSurname()).toBe("Doe");
    expect(validPerson.getEmail()).toBe("john.doe@email.com");
    expect(validPerson.getPhone()).toBe("123456789");
    expect(validPerson.getBirthDate()).toBe(validDate);
});