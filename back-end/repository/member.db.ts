import database from "../util/database";
import { Member } from "../model/member";

const getAllMembers = async (): Promise<Member[]> => {
    const membersPrisma = await database.member.findMany(
        {
            include: {
                person: true
            }
        }
    );
    return membersPrisma.map((memberPrisma) => Member.from(memberPrisma));
}

const getMemberById = async ({ id }: { id: number }): Promise<Member | null> => {
    const memberPrisma = await database.member.findUnique({
        where: { id },
        include: { person: true },
    });

    return memberPrisma ? Member.from(memberPrisma) : null;
}

const getMemberByPersonEmail = async ({ email }: { email: string }): Promise<Member | null> => {
    const memberPrisma = await database.member.findFirst({
        where: { person: { email } },
        include: { person: true },
    });

    return memberPrisma ? Member.from(memberPrisma) : null;
}

export default { getAllMembers, getMemberById, getMemberByPersonEmail };