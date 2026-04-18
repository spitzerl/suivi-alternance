/*
  Warnings:

  - You are about to drop the column `dateContact` on the `Application` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "dateContact",
ADD COLUMN     "applicationUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateApplication" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "priority" INTEGER,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastname" TEXT NOT NULL DEFAULT 'Nom',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Prenom';

-- CreateTable
CREATE TABLE "Relaunch" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "method" TEXT,
    "notes" TEXT,
    "response" BOOLEAN,

    CONSTRAINT "Relaunch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Relaunch_applicationId_idx" ON "Relaunch"("applicationId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relaunch" ADD CONSTRAINT "Relaunch_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
