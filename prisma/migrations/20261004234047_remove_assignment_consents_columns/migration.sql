/*
  Warnings:

  - You are about to drop the column `consentRespondedAt` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `consentStatus` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `consentVersion` on the `assignments` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[assignments] DROP COLUMN [consentRespondedAt],
[consentStatus],
[consentVersion];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
