-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'BACK_OFFICE', 'SALES', 'AGENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "passwordToken" TEXT,
    "passwordTokenExpiresAt" TIMESTAMP(3),
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BACK_OFFICE',
    "profilePictureUrl" TEXT,
    "profileQr" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
