-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "type" "SubscriptionType" NOT NULL DEFAULT 'FREE';
