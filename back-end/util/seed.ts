// execute npx ts-node util/seed.ts to seed the database

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {

    await prisma.person.deleteMany();
    await prisma.region.deleteMany();
    await prisma.club.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.member.deleteMany();

    const person1 = await prisma.person.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@gmail.com',
            phone: '0123456789',
            birthDate: new Date('1990-01-01'),
        }
    });
    const person2 = await prisma.person.create({
        data: {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@hotmail.com',
            phone: '9876543210',
            birthDate: new Date('1995-01-01'),
        }
    });

    const region1 = await prisma.region.create({
        data: {
            name: 'Antwerpen',
        }
    });

    const region2 = await prisma.region.create({
        data: {
            name: 'Limburg',
        }
    });

    const employee1 = await prisma.employee.create({
        data: {
            admin: true,
            title: 'Manager',
            person: {
                connect: {
                    id: person1.id,
                }
            },
        }
    });

    const member1 = await prisma.member.create({
        data: {
            person: {
                connect: {
                    id: person2.id,
                }
            }, 
            username: 'jane.doe',
            password: 'password', 
        }
    });

    const club1 = await prisma.club.create({
        data: {
            address: 'Bruul 1, 2800 Mechelen',
            region: {
                connect: {
                    id: region1.id,
                }
            },
        }
    });

    const subscription1 = await prisma.subscription.create({
        data: {
            type: 'Club',
            price: 7.99,
            },
    });

    const subscription2 = await prisma.subscription.create({
        data: {
            type: 'Regional',
            price: 19.99,
        }
    });

    const enrollment1 = await prisma.enrollment.create({
        data: {
            enrollmentDate: new Date(),
            member: {
                connect: {
                    id: member1.id,
                }
            },
            club: {
                connect: {
                    id: club1.id,
                }
            },
            subscription: {
                connect: {
                    id: subscription1.id,
                }
            },
            expirationDate: new Date('2024-01-01'),
        }
    });


};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();