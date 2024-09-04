/*
  Warnings:

  - A unique constraint covering the columns `[subject]` on the table `Ability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ability_subject_key" ON "Ability"("subject");
