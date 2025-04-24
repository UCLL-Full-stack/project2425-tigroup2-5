import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        // Count records in each table
        const personCount = await prisma.person.count();
        const memberCount = await prisma.member.count();
        const employeeCount = await prisma.employee.count();
        const regionCount = await prisma.region.count();
        const clubCount = await prisma.club.count();
        const subscriptionCount = await prisma.subscription.count();
        const enrollmentCount = await prisma.enrollment.count();
        const employmentCount = await prisma.employment.count();

        console.log("Database Records Count:");
        console.log("----------------------");
        console.log(`Person: ${personCount}`);
        console.log(`Member: ${memberCount}`);
        console.log(`Employee: ${employeeCount}`);
        console.log(`Region: ${regionCount}`);
        console.log(`Club: ${clubCount}`);
        console.log(`Subscription: ${subscriptionCount}`);
        console.log(`Enrollment: ${enrollmentCount}`);
        console.log(`Employment: ${employmentCount}`);

        // Get sample data if available
        if (personCount > 0) {
            const persons = await prisma.person.findMany({ take: 2 });
            console.log("\nSample Persons:", JSON.stringify(persons, null, 2));
        }

        if (memberCount > 0) {
            const members = await prisma.member.findMany({ 
                take: 2,
                include: { person: true } 
            });
            console.log("\nSample Members:", JSON.stringify(members, null, 2));
        }

        if (regionCount > 0) {
            const regions = await prisma.region.findMany({ take: 2 });
            console.log("\nSample Regions:", JSON.stringify(regions, null, 2));
        }

    } catch (error) {
        console.error("Database check failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase().catch(console.error);