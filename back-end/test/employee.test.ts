import { Employee } from "../model/employee"
import { Club } from "../model/club"
import { Region } from "../model/region"
import { Person } from "../model/person"


const validRegion = new Region(1, "Region 1");
const validClub = new Club(1, validRegion, "Address 1");
const validPerson = new Person("1", "John", "Doe", "john.doe@email.com", "123456789", new Date());

test("given valid values, when: employee is created, then: employee is created with those values", () => {
    const employee = new Employee(1, validClub, validPerson, 1000);

    expect(employee.getId()).toBe(1);
    expect(employee.getClub()).toBe(validClub);
    expect(employee.getPerson()).toBe(validPerson);
    expect(employee.getSalary()).toBe(1000);
})