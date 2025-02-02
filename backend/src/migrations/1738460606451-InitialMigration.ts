import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738460606451 implements MigrationInterface {
    name = 'InitialMigration1738460606451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vote" ("voteId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "voterAddr" varchar NOT NULL, "voteValue" boolean NOT NULL, "proposalCustomIdentifier" integer, CONSTRAINT "UQ_a43ba6360ac3a4c1ec68dd25fbf" UNIQUE ("proposalCustomIdentifier", "voterAddr"))`);
        await queryRunner.query(`CREATE TABLE "proposal" ("proposalId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "proposalCustomIdentifier" varchar NOT NULL, "proposalOwner" varchar NOT NULL, "proposalTitle" varchar NOT NULL, "proposalSummary" varchar NOT NULL, "proposalDescription" varchar NOT NULL, "proposalStatus" varchar NOT NULL, "amountRequested" integer NOT NULL, "profitSharePercent" integer NOT NULL, "daoMultiSigAddr" varchar NOT NULL, "numUpVotes" integer NOT NULL DEFAULT (0), "numDownVotes" integer NOT NULL DEFAULT (0), "daoId" integer)`);
        await queryRunner.query(`CREATE TABLE "member_details" ("memberId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "phoneNumber" integer NOT NULL, "email" varchar NOT NULL, "nationalIdNo" integer NOT NULL, "memberRole" varchar NOT NULL, "memberAddr" varchar, CONSTRAINT "UQ_5e668eb51619e54106c0f650dbe" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_b7b5a1cb0a414e8cfa6884ef72a" UNIQUE ("email"), CONSTRAINT "UQ_c7e510fe78758bf0f89c0181767" UNIQUE ("nationalIdNo"), CONSTRAINT "UQ_5023d6fb4f40d5a65d8301173c8" UNIQUE ("memberAddr"))`);
        await queryRunner.query(`CREATE TABLE "dao" ("daoId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "daoName" varchar NOT NULL, "daoLocation" varchar NOT NULL, "targetAudience" varchar NOT NULL, "daoTitle" varchar NOT NULL, "daoDescription" varchar NOT NULL, "daoOverview" varchar NOT NULL, "multiSigPhoneNo" integer NOT NULL, "kiwango" integer NOT NULL, "accountNo" integer NOT NULL, "nambaZaHisa" integer NOT NULL, "kiasiChaHisa" integer NOT NULL, "interestOnLoans" integer NOT NULL, "daoImageIpfsHash" varchar NOT NULL, "daoRegDocs" varchar NOT NULL, "daoMultiSigAddr" varchar NOT NULL, CONSTRAINT "UQ_1e3aec7cd6d71d9e2a6a3234b60" UNIQUE ("daoName"), CONSTRAINT "UQ_1ce71e5e6838518fdda421a8fc1" UNIQUE ("multiSigPhoneNo"), CONSTRAINT "UQ_fc37e3715b4463145339ed52b9a" UNIQUE ("kiwango"), CONSTRAINT "UQ_e8b455472228143c3f769f89dee" UNIQUE ("daoMultiSigAddr"))`);
        await queryRunner.query(`CREATE TABLE "dao_members_member_details" ("daoDaoId" integer NOT NULL, "memberDetailsMemberId" integer NOT NULL, PRIMARY KEY ("daoDaoId", "memberDetailsMemberId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0203e8060c271353f4f0d67a6" ON "dao_members_member_details" ("daoDaoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0dfebdbc97fd0af99bd3999c4" ON "dao_members_member_details" ("memberDetailsMemberId") `);
        await queryRunner.query(`CREATE TABLE "temporary_vote" ("voteId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "voterAddr" varchar NOT NULL, "voteValue" boolean NOT NULL, "proposalCustomIdentifier" integer, CONSTRAINT "UQ_a43ba6360ac3a4c1ec68dd25fbf" UNIQUE ("proposalCustomIdentifier", "voterAddr"), CONSTRAINT "FK_72b7733dea824077c1939a7ed13" FOREIGN KEY ("proposalCustomIdentifier") REFERENCES "proposal" ("proposalId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_vote"("voteId", "voterAddr", "voteValue", "proposalCustomIdentifier") SELECT "voteId", "voterAddr", "voteValue", "proposalCustomIdentifier" FROM "vote"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`ALTER TABLE "temporary_vote" RENAME TO "vote"`);
        await queryRunner.query(`CREATE TABLE "temporary_proposal" ("proposalId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "proposalCustomIdentifier" varchar NOT NULL, "proposalOwner" varchar NOT NULL, "proposalTitle" varchar NOT NULL, "proposalSummary" varchar NOT NULL, "proposalDescription" varchar NOT NULL, "proposalStatus" varchar NOT NULL, "amountRequested" integer NOT NULL, "profitSharePercent" integer NOT NULL, "daoMultiSigAddr" varchar NOT NULL, "numUpVotes" integer NOT NULL DEFAULT (0), "numDownVotes" integer NOT NULL DEFAULT (0), "daoId" integer, CONSTRAINT "FK_cc924568991bd2f04e133baac5d" FOREIGN KEY ("daoId") REFERENCES "dao" ("daoId") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_proposal"("proposalId", "proposalCustomIdentifier", "proposalOwner", "proposalTitle", "proposalSummary", "proposalDescription", "proposalStatus", "amountRequested", "profitSharePercent", "daoMultiSigAddr", "numUpVotes", "numDownVotes", "daoId") SELECT "proposalId", "proposalCustomIdentifier", "proposalOwner", "proposalTitle", "proposalSummary", "proposalDescription", "proposalStatus", "amountRequested", "profitSharePercent", "daoMultiSigAddr", "numUpVotes", "numDownVotes", "daoId" FROM "proposal"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`ALTER TABLE "temporary_proposal" RENAME TO "proposal"`);
        await queryRunner.query(`DROP INDEX "IDX_a0203e8060c271353f4f0d67a6"`);
        await queryRunner.query(`DROP INDEX "IDX_f0dfebdbc97fd0af99bd3999c4"`);
        await queryRunner.query(`CREATE TABLE "temporary_dao_members_member_details" ("daoDaoId" integer NOT NULL, "memberDetailsMemberId" integer NOT NULL, CONSTRAINT "FK_a0203e8060c271353f4f0d67a6c" FOREIGN KEY ("daoDaoId") REFERENCES "dao" ("daoId") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f0dfebdbc97fd0af99bd3999c4e" FOREIGN KEY ("memberDetailsMemberId") REFERENCES "member_details" ("memberId") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("daoDaoId", "memberDetailsMemberId"))`);
        await queryRunner.query(`INSERT INTO "temporary_dao_members_member_details"("daoDaoId", "memberDetailsMemberId") SELECT "daoDaoId", "memberDetailsMemberId" FROM "dao_members_member_details"`);
        await queryRunner.query(`DROP TABLE "dao_members_member_details"`);
        await queryRunner.query(`ALTER TABLE "temporary_dao_members_member_details" RENAME TO "dao_members_member_details"`);
        await queryRunner.query(`CREATE INDEX "IDX_a0203e8060c271353f4f0d67a6" ON "dao_members_member_details" ("daoDaoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0dfebdbc97fd0af99bd3999c4" ON "dao_members_member_details" ("memberDetailsMemberId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f0dfebdbc97fd0af99bd3999c4"`);
        await queryRunner.query(`DROP INDEX "IDX_a0203e8060c271353f4f0d67a6"`);
        await queryRunner.query(`ALTER TABLE "dao_members_member_details" RENAME TO "temporary_dao_members_member_details"`);
        await queryRunner.query(`CREATE TABLE "dao_members_member_details" ("daoDaoId" integer NOT NULL, "memberDetailsMemberId" integer NOT NULL, PRIMARY KEY ("daoDaoId", "memberDetailsMemberId"))`);
        await queryRunner.query(`INSERT INTO "dao_members_member_details"("daoDaoId", "memberDetailsMemberId") SELECT "daoDaoId", "memberDetailsMemberId" FROM "temporary_dao_members_member_details"`);
        await queryRunner.query(`DROP TABLE "temporary_dao_members_member_details"`);
        await queryRunner.query(`CREATE INDEX "IDX_f0dfebdbc97fd0af99bd3999c4" ON "dao_members_member_details" ("memberDetailsMemberId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0203e8060c271353f4f0d67a6" ON "dao_members_member_details" ("daoDaoId") `);
        await queryRunner.query(`ALTER TABLE "proposal" RENAME TO "temporary_proposal"`);
        await queryRunner.query(`CREATE TABLE "proposal" ("proposalId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "proposalCustomIdentifier" varchar NOT NULL, "proposalOwner" varchar NOT NULL, "proposalTitle" varchar NOT NULL, "proposalSummary" varchar NOT NULL, "proposalDescription" varchar NOT NULL, "proposalStatus" varchar NOT NULL, "amountRequested" integer NOT NULL, "profitSharePercent" integer NOT NULL, "daoMultiSigAddr" varchar NOT NULL, "numUpVotes" integer NOT NULL DEFAULT (0), "numDownVotes" integer NOT NULL DEFAULT (0), "daoId" integer)`);
        await queryRunner.query(`INSERT INTO "proposal"("proposalId", "proposalCustomIdentifier", "proposalOwner", "proposalTitle", "proposalSummary", "proposalDescription", "proposalStatus", "amountRequested", "profitSharePercent", "daoMultiSigAddr", "numUpVotes", "numDownVotes", "daoId") SELECT "proposalId", "proposalCustomIdentifier", "proposalOwner", "proposalTitle", "proposalSummary", "proposalDescription", "proposalStatus", "amountRequested", "profitSharePercent", "daoMultiSigAddr", "numUpVotes", "numDownVotes", "daoId" FROM "temporary_proposal"`);
        await queryRunner.query(`DROP TABLE "temporary_proposal"`);
        await queryRunner.query(`ALTER TABLE "vote" RENAME TO "temporary_vote"`);
        await queryRunner.query(`CREATE TABLE "vote" ("voteId" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "voterAddr" varchar NOT NULL, "voteValue" boolean NOT NULL, "proposalCustomIdentifier" integer, CONSTRAINT "UQ_a43ba6360ac3a4c1ec68dd25fbf" UNIQUE ("proposalCustomIdentifier", "voterAddr"))`);
        await queryRunner.query(`INSERT INTO "vote"("voteId", "voterAddr", "voteValue", "proposalCustomIdentifier") SELECT "voteId", "voterAddr", "voteValue", "proposalCustomIdentifier" FROM "temporary_vote"`);
        await queryRunner.query(`DROP TABLE "temporary_vote"`);
        await queryRunner.query(`DROP INDEX "IDX_f0dfebdbc97fd0af99bd3999c4"`);
        await queryRunner.query(`DROP INDEX "IDX_a0203e8060c271353f4f0d67a6"`);
        await queryRunner.query(`DROP TABLE "dao_members_member_details"`);
        await queryRunner.query(`DROP TABLE "dao"`);
        await queryRunner.query(`DROP TABLE "member_details"`);
        await queryRunner.query(`DROP TABLE "proposal"`);
        await queryRunner.query(`DROP TABLE "vote"`);
    }

}
