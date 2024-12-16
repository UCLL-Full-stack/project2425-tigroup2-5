import { Club } from '../model/club';
import { Region } from '../model/region';

const clubs: Club[] = [];

const getAllClubs = (): Club[] => clubs;

const getClubById = (id: number): Club | undefined => clubs.find((club) => club.id === id);

export default { getAllClubs, getClubById };