-- AlterTable
ALTER TABLE "products" ADD COLUMN     "channels" JSONB NOT NULL DEFAULT '[]';
