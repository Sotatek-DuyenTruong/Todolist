-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'MEMBER', 'PT');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('ONE_ON_ONE', 'TWO_ON_ONE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password_hash" TEXT,
    "role" "Role" NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_membership_packages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "included_activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "gym_membership_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gym_contracts" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "package_id" UUID NOT NULL,
    "contract_number" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "contract_price" DECIMAL(12,2) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "gym_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pt_packages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "total_sessions" INTEGER NOT NULL,
    "training_type" "TrainingType" NOT NULL,
    "validity_days" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "pt_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pt_contracts" (
    "id" UUID NOT NULL,
    "package_id" UUID NOT NULL,
    "pt_id" UUID NOT NULL,
    "contract_number" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "total_sessions" INTEGER NOT NULL,
    "remaining_sessions" INTEGER NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "pt_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pt_contract_members" (
    "id" UUID NOT NULL,
    "pt_contract_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "pt_contract_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pt_session_records" (
    "id" UUID NOT NULL,
    "pt_contract_id" UUID NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SessionStatus" NOT NULL DEFAULT 'COMPLETED',
    "recorded_by" UUID NOT NULL,

    CONSTRAINT "pt_session_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gym_contracts_contract_number_key" ON "gym_contracts"("contract_number");

-- CreateIndex
CREATE UNIQUE INDEX "pt_contracts_contract_number_key" ON "pt_contracts"("contract_number");

-- CreateIndex
CREATE UNIQUE INDEX "pt_contract_members_pt_contract_id_member_id_key" ON "pt_contract_members"("pt_contract_id", "member_id");

-- AddForeignKey
ALTER TABLE "gym_contracts" ADD CONSTRAINT "gym_contracts_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gym_contracts" ADD CONSTRAINT "gym_contracts_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "gym_membership_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_contracts" ADD CONSTRAINT "pt_contracts_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "pt_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_contracts" ADD CONSTRAINT "pt_contracts_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_contract_members" ADD CONSTRAINT "pt_contract_members_pt_contract_id_fkey" FOREIGN KEY ("pt_contract_id") REFERENCES "pt_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_contract_members" ADD CONSTRAINT "pt_contract_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_session_records" ADD CONSTRAINT "pt_session_records_pt_contract_id_fkey" FOREIGN KEY ("pt_contract_id") REFERENCES "pt_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pt_session_records" ADD CONSTRAINT "pt_session_records_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
