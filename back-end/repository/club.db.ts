import database from '../util/database';
import { Club } from '../model/club';

const getAllClubs = async (): Promise<Club[]> => {
    const clubsPrisma = await database.club.findMany(
        {
            include: {
                region: true
            }
        }
    );
    return clubsPrisma.map((clubPrisma) => Club.from(clubPrisma));
}

const getClubById = async (id: number): Promise<Club | null> => {
    const clubPrisma = await database.club.findUnique({
        where: {
            id: id
        },
        include: {
            region: true
        }
    });

    if (clubPrisma === null) {
        return null;
    }

    return Club.from(clubPrisma);
}

const createClub = async (clubData: Partial<Club> & { regionId: number }): Promise<Club> => {
    const { address, regionId } = clubData;
    if (!address || !regionId) {
        throw new Error("Address and regionId are required");
    }
    const newClub = await database.club.create({
        data: {
            address,
            region: {
                connect: {
                    id: regionId
                }
            }
        },
        include: {
            region: true 
        }
    });
    return Club.from(newClub);
};
export default { getAllClubs, getClubById, createClub };