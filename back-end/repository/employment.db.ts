import database from '../util/database';
import { Employment } from '../model/employment';

const getAllEmployments = async (): Promise<Employment[]> => {
    const employmentsPrisma = await database.employment.findMany(
        {
            include: {
                employee: {
                    include: {
                        person: true
                    }
                },
                club: {
                    include: {
                        region: true
                    }
                }
            }
        }
    );

    return employmentsPrisma.map((employmentPrisma) => Employment.from(employmentPrisma));
}

const getEmploymentById = async (id: number): Promise<Employment | null> => {
    const employmentPrisma = await database.employment.findUnique({
        where: {
            id: id
        },
        include: {
            employee: {
                include: {
                    person: true
                }
            },
            club: {
                include: {
                    region: true
                }
            }
        }
    });

    if (employmentPrisma === null) {
        return null;
    }

    return Employment.from(employmentPrisma);
}

export default { getAllEmployments, getEmploymentById };