import employmentDb from '../repository/employment.db';
import { Employment } from '../model/employment';

const getAllEmployments = async(): Promise<Employment[]> => employmentDb.getAllEmployments();

const getEmploymentById = async(id: number): Promise<Employment> => {
    const employment = await employmentDb.getEmploymentById(id);
    if(employment === undefined) throw new Error(`Employment with id ${id} not found`);
    return employment;
};

export default { getAllEmployments, getEmploymentById };