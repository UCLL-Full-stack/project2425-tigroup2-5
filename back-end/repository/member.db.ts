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

const getMemberByEmail = async (email: string): Promise<Member | null> => {
    console.log(`[DEBUG] Looking for member with email: ${email}`);
    
    const memberPrisma = await database.member.findFirst({
        where: {
            person: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        },
        include: { 
            person: true
        }
    });

    console.log(`[DEBUG] Member query result: ${memberPrisma ? `Found ID: ${memberPrisma.id}` : 'Not found'}`);
    console.log(`[DEBUG] Password exists: ${memberPrisma?.password ? 'Yes' : 'No'}`);

    return memberPrisma ? Member.from(memberPrisma) : null;
}

const createMember = async (memberData: Partial<Member> & { username?: string }): Promise<Member> => {
    const { person: personData, ...memberOnly } = memberData;
    
    let personConnect;
    if (personData?.id) {
        personConnect = { id: personData.id };
    } else if (personData) {
        // Calculate a default birth date that makes the person 18 years old
        const defaultBirthDate = new Date();
        defaultBirthDate.setFullYear(defaultBirthDate.getFullYear() - 18);
        
        const createdPerson = await database.person.create({
            data: {
                firstName: personData.firstname || '',
                lastName: personData.surname || '',
                email: personData.email || '',
                phone: personData.phone || '',
                birthDate: personData.birthDate || defaultBirthDate, // Default to 18 years old
            }
        });
        personConnect = { id: createdPerson.id };
    }
    
    const memberPrisma = await database.member.create({
        data: {
            username: memberOnly.username || memberData.username || `user_${Date.now()}`, // Added username field with fallbacks
            password: memberOnly.password!, 
            person: personConnect ? 
                { connect: personConnect } : 
                { 
                    create: { 
                        firstName: '', 
                        lastName: '', 
                        email: '', 
                        phone: '', 
                        // Calculate a default birth date that makes the person 18 years old
                        birthDate: (() => {
                            const defaultBirthDate = new Date();
                            defaultBirthDate.setFullYear(defaultBirthDate.getFullYear() - 18);
                            return defaultBirthDate;
                        })() 
                    } 
                }, // Ensure person is always defined with valid age
        },
        include: { person: true }
    });

    return Member.from(memberPrisma);
}

const updateMember = async (id: number, updateData: Partial<Member> & { username?: string }): Promise<void> => {
    const { person: personData, ...memberOnly } = updateData;

    if (personData) {
        await database.person.update({
        where: { id: id },
        data: {
            firstName: personData.firstname,
            lastName: personData.surname,
            email: personData.email,
            phone: personData.phone,
        },
        });
    }

    await database.member.update({
        where: { id: id },
        data: {
        username: memberOnly.username,
        password: memberOnly.password,
        },
    });
  
}

export default { getAllMembers, getMemberById, getMemberByEmail, createMember, updateMember };