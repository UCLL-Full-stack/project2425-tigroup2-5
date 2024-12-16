import regionDb from "../repository/region.db";
import { Region } from "../model/region";

const getAllRegions = async(): Promise<Region[]> => regionDb.getAllRegions();

const getRegionById = async(id: number): Promise<Region> => {
    const region = await regionDb.getRegionById(id);
    if(region === undefined) throw new Error(`Region with id ${id} not found`);
    return region;
};

export default { getAllRegions, getRegionById };