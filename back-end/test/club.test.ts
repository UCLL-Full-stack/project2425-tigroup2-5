import { Club } from "../model/club";
import { Region } from "../model/region";

let validRegion = new Region(1, "Region 1");

test('given valid values, when: club is created, then: club is created with those values', () => { 

    const club = new Club(1, validRegion, "Address 1");

    expect(club.getId()).toBe(1);
    expect(club.getRegion()).toBe(validRegion);
    expect(club.getAddress()).toBe("Address 1");

})