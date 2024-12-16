import { Employee } from "../model/employee"
import { Club } from "../model/club"
import { Region } from "../model/region"
import { Person } from "../model/person"


const validRegion = new Region({id: 1, name: "Region 1"});
const validClub = new Club({id: 1, region: validRegion, address: "Address 1"});
const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date()});

test("given valid values, when: employee is created, then: employee is created with those values", () => {
    const employee = new Employee({id: 1, club: validClub, person: validPerson, salary: 1000});

    expect(employee.id).toBe(1);
    expect(employee.club).toBe(validClub);
    expect(employee.person).toBe(validPerson);
    expect(employee.salary).toBe(1000);
})