/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Club` table. All the data in the column will be lost.
  - Added the required column `employmentId` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollmentId` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_employeeId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "employeeId",
ADD COLUMN     "employmentId" INTEGER NOT NULL,
ADD COLUMN     "enrollmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employmentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Employment" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
