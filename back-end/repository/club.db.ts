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

export default { getAllClubs, getClubById };