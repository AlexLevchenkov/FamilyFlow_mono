-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'shared';

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "currentValue" DROP NOT NULL,
ALTER COLUMN "targetValue" DROP NOT NULL;
