import enrollmentDb from "../repository/enrollment.db";
import { Enrollment } from "../model/enrollment";

const getAllEnrollments = async(): Promise<Enrollment[]> => enrollmentDb.getAllEnrollments();

const getEnrollmentById = async(id: number): Promise<Enrollment> => {
    const enrollment = await enrollmentDb.getEnrollmentById(id);
    if(enrollment === null) throw new Error(`Enrollment with id ${id} not found`);
    return enrollment;
}

export default { getAllEnrollments, getEnrollmentById };