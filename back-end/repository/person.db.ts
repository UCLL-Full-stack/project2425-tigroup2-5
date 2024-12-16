import { Person } from '../model/person';

let currentId = 1;

const persons: Person[] = [];

const getAllPersons = (): Person[] => persons;

const getPersonByNrn = (nrn: string): Person | undefined => persons.find((person) => person.nrn === nrn);

export default { getAllPersons, getPersonByNrn };