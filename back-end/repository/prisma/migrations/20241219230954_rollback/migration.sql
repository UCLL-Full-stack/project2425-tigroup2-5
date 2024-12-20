/*
  Warnings:

  - Made the column `employeeId` on table `Employment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clubId` on table `Employment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Employment" DROP CONSTRAINT "Employment_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Employment" DROP CONSTRAINT "Employment_employeeId_fkey";

-- AlterTable
ALTER TABLE "Employment" ALTER COLUMN "employeeId" SET NOT NULL,
ALTER COLUMN "clubId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
