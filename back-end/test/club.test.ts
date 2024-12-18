import { Club } from "../model/club";
import { Region } from "../model/region";


test('given valid values, when: club is created, then: club is created with those values', () => { 
    let validRegion = new Region({id: 1, name: "Region 1", clubs: []});

    const club = new Club({id: 1, region: validRegion, address: "Address 1", employments: [], enrollments: []});


    expect(club.id).toBe(1);
    expect(club.region).toBe(validRegion);
    expect(club.address).toBe("Address 1");
    expect(club.employments).toStrictEqual([]);
    expect(club.enrollments).toStrictEqual([]);
})