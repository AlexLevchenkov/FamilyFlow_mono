-- AlterTable
ALTER TABLE "FamilyMember"
ADD COLUMN "activated" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "email" TEXT,
ADD COLUMN "inviteToken" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_inviteToken_key" ON "FamilyMember"("inviteToken");

