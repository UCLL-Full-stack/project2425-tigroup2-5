import enrollmentDb from "../repository/enrollment.db";
import { Enrollment } from "../model/enrollment";

const getAllEnrollments = async(): Promise<Enrollment[]> => enrollmentDb.getAllEnrollments();

export default { getAllEnrollments };