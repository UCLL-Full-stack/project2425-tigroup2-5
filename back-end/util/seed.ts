// execute npx ts-node util/seed.ts to seed the database

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const main = async () => {

    await prisma.enrollment.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.employment.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.member.deleteMany();
    await prisma.club.deleteMany();
    await prisma.region.deleteMany();
    await prisma.person.deleteMany();

    // Persons
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
    const person3 = await prisma.person.create({
        data: {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice.smith@yahoo.com',
            phone: '1234567890',
            birthDate: new Date('1992-01-01'),
        }
    });

    // Regions

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

    const region3 = await prisma.region.create({
        data: {
            name: 'Vlaams-Brabant',
        }
    });

    const region4 = await prisma.region.create({
        data: {
            name: 'Oost-Vlaanderen',
        }
    });

    const region5 = await prisma.region.create({
        data: {
            name: 'West-Vlaanderen',
        }
    });

    const region6 = await prisma.region.create({
        data: {
            name: 'Waals-Brabant',
        }
    });

    // Hash passwords before storing
    const adminPassword = await bcrypt.hash('admin123', SALT_ROUNDS);
    const employeePassword = await bcrypt.hash('employee123', SALT_ROUNDS);
    const memberPassword = await bcrypt.hash('password', SALT_ROUNDS);

    const employee1 = await prisma.employee.create({
        data: {
            admin: true,
            title: 'Manager',
            password: adminPassword, // Store hashed password
            person: {
                connect: {
                    id: person1.id,
                }
            },
        }
    });

    const employee2 = await prisma.employee.create({
        data: {
            admin: false,
            title: 'Receptionist',
            password: employeePassword, // Store hashed password
            person: {
                connect: {
                    id: person3.id,
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
            password: memberPassword, // Store hashed password
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
        console.log('Database seeded successfully!');
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();