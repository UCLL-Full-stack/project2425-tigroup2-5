import clubDb from "../repository/club.db";
import { Club } from "../model/club";

const getAllClubs = async(): Promise<Club[]> => clubDb.getAllClubs();

const getClubById = async(id: number): Promise<Club> => {
    const club = await clubDb.getClubById(id);
    if(club === undefined) throw new Error(`Club with id ${id} not found`);
    return club;
};

export default { getAllClubs, getClubById };