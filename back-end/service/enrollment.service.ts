import enrollmentDb from "../repository/enrollment.db";
import { Enrollment } from "../model/enrollment";

const getAllEnrollments = async(): Promise<Enrollment[]> => enrollmentDb.getAllEnrollments();

const getEnrollmentById = async(id: number): Promise<Enrollment> => {
    const enrollment = await enrollmentDb.getEnrollmentById(id);
    if(enrollment === null) throw new Error(`Enrollment with id ${id} not found`);
    return enrollment;
}

const createEnrollment = async(enrollmentData: Partial<Enrollment>): Promise<Enrollment> => {
    // Validate required fields
    if (!enrollmentData.member?.id) throw new Error("Member ID is required");
    if (!enrollmentData.subscription?.id) throw new Error("Subscription ID is required");
    
    // Make clubId and regionId optional, don't default to 0 which causes FK violations
    const clubId = enrollmentData.club?.id || null;
    const regionId = enrollmentData.region?.id || null;
    
    // Set default dates if not provided
    const enrollmentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    const enrollment = await enrollmentDb.createEnrollment({
        memberId: enrollmentData.member.id,
        subscriptionId: enrollmentData.subscription.id,
        clubId, // Only pass clubId if it exists
        regionId, // Only pass regionId if it exists
        enrollmentDate,
        expirationDate: enrollmentData.expirationDate || expirationDate
    });
    
    return enrollment;
};

const getEnrollmentsByMemberId = async(memberId: number): Promise<Enrollment[]> => {
    return enrollmentDb.getEnrollmentsByMemberId(memberId);
};

export default { getAllEnrollments, getEnrollmentById, createEnrollment, getEnrollmentsByMemberId };