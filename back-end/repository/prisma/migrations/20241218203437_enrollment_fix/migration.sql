-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_regionId_fkey";

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "regionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
