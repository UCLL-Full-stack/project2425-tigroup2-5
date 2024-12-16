import { Region } from '../model/region';

let currentId = 1;

const regions: Region[] = [
    new Region({id: currentId++, name: 'Antwerpen'}),
    new Region({id: currentId++, name: 'Limburg'}),
    new Region({id: currentId++, name: 'Oost-Vlaanderen'}),
    new Region({id: currentId++, name: 'Vlaams-Brabant'}),
    new Region({id: currentId++, name: 'West-Vlaanderen'}),
];

const getAllRegions = (): Region[] => regions;

const getRegionById = (id: number): Region | undefined => regions.find((region) => region.id === id);

const getRegionByName = (name: string): Region | undefined => regions.find((region) => region.name === name);

export default { getAllRegions, getRegionById, getRegionByName };