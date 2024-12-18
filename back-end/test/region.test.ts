import { Region } from "../model/region";

test("given valid values, when: region is created, then: region is created with those values", () => {
    const region = new Region({id: 1, name: "Region 1", clubs: []});

    expect(region.id).toBe(1);
    expect(region.name).toBe("Region 1");
});