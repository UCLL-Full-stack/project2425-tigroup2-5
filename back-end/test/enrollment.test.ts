import { Enrollment } from "../model/enrollment";
import { Region } from "../model/region";
import { Club } from "../model/club";
import { Person } from "../model/person";
import { Member } from "../model/member";
import { Subscription } from "../model/subscription";

const validRegion = new Region(1, "Region 1");
const validPerson = new Person("1", "John", "Doe", "john.doe@email.com", "123456789", new Date());

const validSubscription = new Subscription(1, "Subscription 1", 1000);
const validMember = new Member(1, validPerson);
const validClub = new Club(1, validRegion, "Address 1");

test("given valid values, when: enrollment is created, then: enrollment is created with those values", () => {
    
    const enrollment = new Enrollment(1, validSubscription, validMember, validClub, validRegion);

    expect(enrollment.getId()).toBe(1);
    expect(enrollment.getMember()).toBe(validMember);
    expect(enrollment.getClub()).toBe(validClub);
    expect(enrollment.getSubscription()).toBe(validSubscription);
    expect(enrollment.getRegion()).toBe(validRegion); 
});