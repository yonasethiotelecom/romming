-- CreateEnum
CREATE TYPE "Jobshift" AS ENUM ('day', 'mid', 'night');

-- AlterTable
ALTER TABLE "Moc_Asr" ADD COLUMN     "shift" "Jobshift" NOT NULL DEFAULT 'day';
