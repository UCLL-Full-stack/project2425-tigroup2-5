import { Club } from '../model/club';
import { Region } from '../model/region';

let currentId = 1;

const clubs: Club[] = [];

const addClub = (region: Region, address: string): void => {
    clubs.push(new Club({id: currentId++, region, address}));
}

const getAllClubs = (): Club[] => clubs;

const getClubById = (id: number): Club | undefined => clubs.find((club) => club.id === id);

export default { addClub, getAllClubs, getClubById };