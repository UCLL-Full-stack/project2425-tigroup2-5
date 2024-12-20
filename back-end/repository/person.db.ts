import database from '../util/database';
import { Person } from '../model/person';

const getAllPersons = async (): Promise<Person[]> => {
    const personsPrisma = await database.person.findMany();
    return personsPrisma.map((personPrisma) => Person.from(personPrisma));
}

const getPersonByNrn = async (nrn: string): Promise<Person | null> => {
    const personPrisma = await database.person.findUnique({
        where: {
            id: parseInt(nrn)
        }
    });

    if (personPrisma === null) {
        return null;
    }

    return Person.from(personPrisma);
}

const createPerson = async (person: Person): Promise<Person> => {
    const personPrisma = await database.person.create({
        data: {
            firstName: person.firstname,
            lastName: person.surname,
            email: person.email,
            phone: person.phone,
            birthDate: person.birthDate,
        }
    });

    return Person.from(personPrisma);
}

export default { getAllPersons, getPersonByNrn };