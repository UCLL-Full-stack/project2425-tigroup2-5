import test from "node:test";
import { Club } from "../model/club";
import { Region } from "../model/region";

let validRegion = new Region(1, "Region 1");

beforeAll(() => {
})

beforeEach(() => {
})

test('given valid values, when: club is created, then: club is created with those values', () => { 
    // Exercise
    const club = new Club(1, validRegion, "Address 1");

    // Verify
    expect(club.getId()).toBe(1);
    expect(club.getRegion()).toBe(validRegion);
    expect(club.getAddress()).toBe("Address 1");
})