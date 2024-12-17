import { Person } from '../model/person';
import { PersonInput } from '../types';

let currentId = 1;

// dummy data
const persons: Person[] = [
    new Person({
        nrn: ""+currentId++,
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@email.com',
        phone: '0123456789',
        birthDate: new Date('1990-01-01'),
    }),
    new Person({
        nrn: ""+currentId++,
        firstname: 'Jane',
        surname: 'Doe',
        email: 'jane.doe@email.com',
        phone: '9876543210',
        birthDate: new Date('1995-01-01'),
    }),
];

const addPerson = ({ firstName, lastName, email, phone, birthDate }:PersonInput): void => {
    persons.push(new Person({nrn: ""+currentId++, firstname: firstName, surname: lastName, email, phone, birthDate}));
}

const getAllPersons = (): Person[] => persons;

const getPersonByNrn = (nrn: string): Person | undefined => persons.find((person) => person.nrn === nrn);

export default { addPerson, getAllPersons, getPersonByNrn };