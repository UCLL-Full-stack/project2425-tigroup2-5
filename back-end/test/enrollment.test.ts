// import { Enrollment } from "../model/enrollment";
// import { Region } from "../model/region";
// import { Club } from "../model/club";
// import { Person } from "../model/person";
// import { Member } from "../model/member";
// import { Subscription } from "../model/subscription";

// test("given valid values, when: enrollment is created, then: enrollment is created with those values", () => {
    
//     //given
//     const validRegion = new Region({id: 1, name: "Region 1", clubs: []});
//     const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')});
//     const validSubscription = new Subscription({id: 1, type: "Subscription 1", price: 100, enrollments: []});
//     const validMember = new Member({id: 1, person: validPerson, enrollments: []});
//     const validClub = new Club({id: 1, address: "address", region: validRegion, employments: [], enrollments: []});

//     //when
//     const enrollment = new Enrollment({id: 1, subscription: validSubscription, member: validMember, club: validClub, region: validRegion});

//     //then
//     expect(enrollment.id).toBe(1);
//     expect(enrollment.subscription).toBe(validSubscription);
//     expect(enrollment.member).toBe(validMember);
//     expect(enrollment.club).toBe(validClub);
//     expect(enrollment.region).toBe(validRegion);

// });

// test("given valid values, when: enrollment is created, then: enrollment is added to member", () => {
    
//     //given
//     const validRegion = new Region({id: 1, name: "Region 1", clubs: []});
//     const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date('1995-01-01')});
//     const validSubscription = new Subscription({id: 1, type: "Subscription 1", price: 100, enrollments: []});
//     const validMember = new Member({id: 1, person: validPerson, enrollments: []});
//     const validClub = new Club({id: 1, address: "address", region: validRegion, employments: [], enrollments: []});

//     //when
//     const enrollment = new Enrollment({id: 1, subscription: validSubscription, member: validMember, club: validClub, region: validRegion});

//     //then
//     expect(validMember.enrollments).toStrictEqual([enrollment]);
// });
