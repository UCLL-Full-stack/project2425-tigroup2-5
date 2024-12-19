import database from '../util/database';
import { Enrollment } from '../model/enrollment';

const getAllEnrollments = async (): Promise<Enrollment[]> => {
    const enrollmentsPrisma = await database.enrollment.findMany(
        {
            include: {
                member: {
                    include: {
                        person: true
                    }
                },
                subscription: true,
                region: true,
                club: {
                    include: {
                        region: true
                    }
                }
            }
        }
    );
    return enrollmentsPrisma.map((enrollmentPrisma) => Enrollment.from(enrollmentPrisma));
}

const getEnrollmentById = async (id: number): Promise<Enrollment | null> => {
    const enrollmentPrisma = await database.enrollment.findUnique({
        where: {
            id: id
        },
        include: {
            member: {
                include: {
                    person: true
                }
            },
            subscription: true,
            region: true,
            club: {
                include: {
                    region: true
                }
            }
        }
    });

    if (enrollmentPrisma === null) {
        return null;
    }

    return Enrollment.from(enrollmentPrisma);
}

export default { getAllEnrollments, getEnrollmentById };