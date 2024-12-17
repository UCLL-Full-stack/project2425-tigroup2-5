import { Enrollment } from '../model/enrollment';

let currentId = 1;

const enrollments: Enrollment[] = [
];

const getAllEnrollments = (): Enrollment[] => enrollments;

const getEnrollmentById = (id: number): Enrollment | undefined => enrollments.find((enrollment) => enrollment.id === id);

export default { getAllEnrollments, getEnrollmentById };