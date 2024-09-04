-- DropForeignKey
ALTER TABLE "InboundRoamer2G" DROP CONSTRAINT "InboundRoamer2G_fileId_fkey";

-- DropForeignKey
ALTER TABLE "InboundRoamer3G" DROP CONSTRAINT "InboundRoamer3G_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Lusr2G" DROP CONSTRAINT "Lusr2G_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Lusr3G" DROP CONSTRAINT "Lusr3G_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Moc_Asr" DROP CONSTRAINT "Moc_Asr_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Mtc_Asr" DROP CONSTRAINT "Mtc_Asr_fileId_fkey";

-- DropForeignKey
ALTER TABLE "SumOfAverages2G" DROP CONSTRAINT "SumOfAverages2G_fileId_fkey";

-- DropForeignKey
ALTER TABLE "SumOfAverages3G" DROP CONSTRAINT "SumOfAverages3G_fileId_fkey";

-- AddForeignKey
ALTER TABLE "SumOfAverages2G" ADD CONSTRAINT "SumOfAverages2G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SumOfAverages3G" ADD CONSTRAINT "SumOfAverages3G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundRoamer2G" ADD CONSTRAINT "InboundRoamer2G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundRoamer3G" ADD CONSTRAINT "InboundRoamer3G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lusr2G" ADD CONSTRAINT "Lusr2G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lusr3G" ADD CONSTRAINT "Lusr3G_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moc_Asr" ADD CONSTRAINT "Moc_Asr_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mtc_Asr" ADD CONSTRAINT "Mtc_Asr_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileName"("id") ON DELETE CASCADE ON UPDATE CASCADE;
