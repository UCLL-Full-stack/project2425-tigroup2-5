import { Club } from "../model/club";
import { Region } from "../model/region";

let validRegion = new Region({id: 1, name: "Region 1"});

test('given valid values, when: club is created, then: club is created with those values', () => { 

    const club = new Club({id: 1, region: validRegion, address: "Address 1"});

    expect(club.id).toBe(1);
    expect(club.region).toBe(validRegion);
    expect(club.address).toBe("Address 1");

})