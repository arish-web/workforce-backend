-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_locationId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
