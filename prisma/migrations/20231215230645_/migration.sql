/*
  Warnings:

  - You are about to drop the column `user` on the `Pixel` table. All the data in the column will be lost.
  - Made the column `userId` on table `Pixel` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Pixel" DROP CONSTRAINT "Pixel_userId_fkey";

-- AlterTable
ALTER TABLE "Pixel" DROP COLUMN "user",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Pixel" ADD CONSTRAINT "Pixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
