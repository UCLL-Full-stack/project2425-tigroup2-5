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

const createEnrollment = async (enrollmentData: { 
    memberId: number; 
    subscriptionId: number; 
    clubId?: number | null; 
    regionId?: number | null; 
    enrollmentDate: Date; 
    expirationDate: Date 
}): Promise<Enrollment> => {
    const { memberId, subscriptionId, clubId, regionId, enrollmentDate, expirationDate } = enrollmentData;

    const enrollmentPrisma = await database.enrollment.create({
        data: {
            memberId,
            subscriptionId,
            clubId: clubId || undefined,
            regionId: regionId || undefined,
            enrollmentDate,
            expirationDate
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

    return Enrollment.from(enrollmentPrisma);
}

const getEnrollmentsByMemberId = async (memberId: number): Promise<Enrollment[]> => {
    const enrollmentsPrisma = await database.enrollment.findMany({
        where: {
            memberId: memberId
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

    return enrollmentsPrisma.map((enrollmentPrisma) => Enrollment.from(enrollmentPrisma));
}

export default { getAllEnrollments, getEnrollmentById, createEnrollment, getEnrollmentsByMemberId };