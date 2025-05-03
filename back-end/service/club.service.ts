import clubDb from "../repository/club.db";
import { Club } from "../model/club";

const getAllClubs = async(): Promise<Club[]> => clubDb.getAllClubs();

const getClubById = async(id: number): Promise<Club> => {
    const club = await clubDb.getClubById(id);
    if(club === null) throw new Error(`Club with id ${id} not found`);
    return club;
};

const createClub = async(clubData: Partial<Club>): Promise<Club> => {
    const { address, region } = clubData;
    if (!address || !region) {
        throw new Error("Address and region are required");
    }
    const newClub = await clubDb.createClub({
        address, region,
        regionId: 0
    });
    if (!newClub) {
        throw new Error("Failed to create club");
    }
    return newClub;
};

export default { getAllClubs, getClubById, createClub };