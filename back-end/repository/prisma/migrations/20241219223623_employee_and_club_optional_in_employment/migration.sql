-- DropForeignKey
ALTER TABLE "Employment" DROP CONSTRAINT "Employment_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Employment" DROP CONSTRAINT "Employment_employeeId_fkey";

-- AlterTable
ALTER TABLE "Employment" ALTER COLUMN "employeeId" DROP NOT NULL,
ALTER COLUMN "clubId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
