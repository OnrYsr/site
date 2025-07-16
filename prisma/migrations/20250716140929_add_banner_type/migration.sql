-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('HERO', 'FEATURED_PRODUCTS');

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "type" "BannerType" NOT NULL DEFAULT 'HERO';
