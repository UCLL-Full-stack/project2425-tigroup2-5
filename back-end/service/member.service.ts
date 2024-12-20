import memberDb from "../repository/member.db";
import { Member } from "../model/member";
import { LoginDTO, AuthenticationResponse, Role } from "../types";
import { generateJwtToken } from "../util/jwt";

const getAllMembers = async(): Promise<Member[]> => memberDb.getAllMembers();

const getMemberById = async(id: number): Promise<Member> => {
    const member = await memberDb.getMemberById({id});
    if(member === null) throw new Error(`Member with id ${id} not found`);
    return member;
};

const getMemberByPersonEmail = async(email: string): Promise<Member> => {
    const member = await memberDb.getMemberByPersonEmail({email});
    if(member === null) throw new Error(`Member with email ${email} not found`);
    return member;
}

const authenticate = async ({ email, password }: LoginDTO): Promise<AuthenticationResponse> => {
    const member = await getMemberByPersonEmail(email);

    const isValidPassword = password == member.password;

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }
    return {
        token: generateJwtToken({ email, role: "member" }),
        email: email,
        fullname: `${member.person.firstname} ${member.person.surname}`,
        role: "member",
    };
};

export default { getAllMembers, getMemberById, authenticate };