import database from '../util/database';
import { Region } from '../model/region';

let currentId = 1;

const getAllRegions = async (): Promise<Region[]> => {
    const regionsPrisma = await database.region.findMany();
    return regionsPrisma.map((regionPrisma) => Region.from(regionPrisma));
}

const getRegionById = async (id: number): Promise<Region | null> => {
    const regionPrisma = await database.region.findUnique({
        where: {
            id: id
        }
    });

    if (regionPrisma === null) {
        return null;
    }

    return Region.from(regionPrisma);
}

const addRegion = async (region: Region): Promise<Region> => {
    const regionPrisma = await database.region.create({
        data: {
            id: currentId++,
            name: region.name,
        }
    });

    return Region.from(regionPrisma);
}

export default { getAllRegions, getRegionById, addRegion };