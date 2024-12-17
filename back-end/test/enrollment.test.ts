import { Enrollment } from "../model/enrollment";
import { Region } from "../model/region";
import { Club } from "../model/club";
import { Person } from "../model/person";
import { Member } from "../model/member";
import { Subscription } from "../model/subscription";

const validRegion = new Region({id: 1, name: "Region 1"});
const validPerson = new Person({nrn: "1", firstname: "John", surname: "Doe", email: "john.doe@email.com", phone: "123456789", birthDate: new Date()});

const validSubscription = new Subscription({id: 1, type: "Subscription 1", price: 1000});
const validMember = new Member({id: 1, person: validPerson});
const validClub = new Club({id: 1, region: validRegion, address: "Address 1"});

test("given valid values, when: enrollment is created, then: enrollment is created with those values", () => {
    
    const enrollment = new Enrollment({id: 1, subscription: validSubscription, member: validMember, club: validClub, region: validRegion});

    expect(enrollment.id).toBe(1);
    expect(enrollment.member).toBe(validMember);
    expect(enrollment.club).toBe(validClub);
    expect(enrollment.subscription).toBe(validSubscription);
    expect(enrollment.region).toBe(validRegion);
});