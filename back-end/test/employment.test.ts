// import { Employee } from "../model/employee"
// import { Club } from "../model/club"
// import { Region } from "../model/region"
// import { Person } from "../model/person"
// import { Employment } from "../model/employment";

// const now = new Date();

// test("given valid values, when: employment is created, then: employment is created with those values", () => {
//     const validClub = new Club({id: 1, address: "address", region: new Region({id: 1, name: "region", clubs: []}), employments: [], enrollments: []});
//     const validEmployee = new Employee({id: 1, person: new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')}), salary: 1000, employments: []});
    
//     const employment = new Employment({id: 1, employee: validEmployee, club: validClub, startDate: now});

//     expect(employment.id).toBe(1);
//     expect(employment.employee).toBe(validEmployee);
//     expect(employment.club).toBe(validClub);
//     expect(employment.startDate).toStrictEqual(now);
// })

// test("given valid values, when: employment is created, then: employment is added to employee", () => {
//     const validClub = new Club({id: 1, address: "address", region: new Region({id: 1, name: "region", clubs: []}), employments: [], enrollments: []});
//     const validEmployee = new Employee({id: 1, person: new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')}), salary: 1000, employments: []});
    
//     const employment = new Employment({id: 1, employee: validEmployee, club: validClub, startDate: now});

//     expect(validEmployee.employments).toStrictEqual([employment]);
// })

// test("given valid values, when: employment is created, then: employment is added to club", () => {
//     const validClub = new Club({id: 1, address: "address", region: new Region({id: 1, name: "region", clubs: []}), employments: [], enrollments: []});
//     const validEmployee = new Employee({id: 1, person: new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')}), salary: 1000, employments: []});
    
//     const employment = new Employment({id: 1, employee: validEmployee, club: validClub, startDate: now});

//     expect(validClub.employments).toStrictEqual([employment]);
// })