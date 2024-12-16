import personDb from "../repository/person.db";
import { Person } from "../model/person";

const getAllPersons = async(): Promise<Person[]> => personDb.getAllPersons();

const getPersonByNrn = async(nrn: string): Promise<Person> => {
    const person = await personDb.getPersonByNrn(nrn);
    if(person === undefined) throw new Error(`Person with nrn ${nrn} not found`);
    return person;
};

export default { getAllPersons, getPersonByNrn };