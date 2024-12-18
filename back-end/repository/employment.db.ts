import { Employment } from '../model/employment';

let currentId = 1;

const employments: Employment[] = [
];

const getAllEmployments = (): Employment[] => employments;

const getEmploymentById = (id: number): Employment | undefined => employments.find((employment) => employment.id === id);

export default { getAllEmployments, getEmploymentById };