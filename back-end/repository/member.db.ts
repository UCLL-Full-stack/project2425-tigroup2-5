import { Member } from "../model/member";
import { Person } from "../model/person";

let currentId = 1;

const members: Member[] = [
];

const addMember = (person: Person): void => {
    members.push(new Member({id: currentId++, person}));
}

const getAllMembers = (): Member[] => members;

const getMemberById = (id: number): Member | undefined => members.find((member) => member.id === id);

export default { getAllMembers, getMemberById };