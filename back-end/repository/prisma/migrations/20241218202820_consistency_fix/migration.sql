/*
  Warnings:

  - You are about to drop the column `employmentId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentId` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `employmentId` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Club" DROP COLUMN "employmentId",
DROP COLUMN "enrollmentId";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employmentId";
