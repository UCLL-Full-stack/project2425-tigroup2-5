import memberDb from "../repository/member.db";
import { Member } from "../model/member";

const getAllMembers = async(): Promise<Member[]> => memberDb.getAllMembers();

const getMemberById = async(id: number): Promise<Member> => {
    const member = await memberDb.getMemberById({id});
    if(member === null) throw new Error(`Member with id ${id} not found`);
    return member;
};

export default { getAllMembers, getMemberById };