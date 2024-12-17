import { Region } from "../model/region";

test("given valid values, when: region is created, then: region is created with those values", () => {
    const region = new Region(1, "Region 1");

    expect(region.getId()).toBe(1);
    expect(region.getName()).toBe("Region 1");
});