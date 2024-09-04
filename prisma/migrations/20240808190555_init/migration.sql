-- AlterTable
ALTER TABLE "InboundRoamer2G" ADD COLUMN     "shift" "Jobshift" NOT NULL DEFAULT 'day';

-- AlterTable
ALTER TABLE "InboundRoamer3G" ADD COLUMN     "shift" "Jobshift" NOT NULL DEFAULT 'day';

-- AlterTable
ALTER TABLE "SumOfAverages2G" ADD COLUMN     "shift" "Jobshift" NOT NULL DEFAULT 'day';

-- AlterTable
ALTER TABLE "SumOfAverages3G" ADD COLUMN     "shift" "Jobshift" NOT NULL DEFAULT 'day';
