/*
  Warnings:

  - A unique constraint covering the columns `[member_id,checkInDate]` on the table `check_ins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkInDate` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_created_by_fkey";

-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "checkInDate" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "check_ins_checked_in_at_idx" ON "check_ins"("checked_in_at");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_member_id_checkInDate_key" ON "check_ins"("member_id", "checkInDate");

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
