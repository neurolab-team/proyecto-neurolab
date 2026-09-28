BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[studyConsents] (
    [studyConsentId] UNIQUEIDENTIFIER NOT NULL,
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [studyCode] NVARCHAR(50) NOT NULL,
    [version] NVARCHAR(50) NOT NULL,
    [status] NVARCHAR(20) NOT NULL,
    [allowsSleepTips] BIT NOT NULL CONSTRAINT [studyConsents_allowsSleepTips_df] DEFAULT 0,
    [allowsStudyInvites] BIT NOT NULL CONSTRAINT [studyConsents_allowsStudyInvites_df] DEFAULT 0,
    [source] NVARCHAR(50) NOT NULL CONSTRAINT [studyConsents_source_df] DEFAULT 'user',
    [respondedAt] DATETIME2 NOT NULL CONSTRAINT [studyConsents_respondedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [studyConsents_pkey] PRIMARY KEY CLUSTERED ([studyConsentId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [studyConsents_userId_studyCode_respondedAt_idx] ON [dbo].[studyConsents]([userId], [studyCode], [respondedAt]);

-- AddForeignKey
ALTER TABLE [dbo].[studyConsents] ADD CONSTRAINT [studyConsents_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[user]([userId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- Backfill: copia las decisiones de consentimiento que hoy viven en
-- [assignments] (una por prueba) al nuevo modelo por estudio. Se copia una
-- fila por cada decisión existente, no solo la última, para no perder
-- historial; la vigente se resuelve en código como la más reciente.
-- Los permisos opcionales quedan en 0 porque nunca se le preguntaron a nadie.
-- Solo se migran las 3 pruebas de sueño de MATELAB II: son las únicas que
-- cubre el texto de este consentimiento.
INSERT INTO [dbo].[studyConsents]
    ([studyConsentId], [userId], [studyCode], [version], [status],
     [allowsSleepTips], [allowsStudyInvites], [source], [respondedAt])
SELECT
    NEWID(),
    a.[assignedToId],
    'MATELAB_II_SLEEP',
    COALESCE(a.[consentVersion], 'matelab-ii-2026-09'),
    a.[consentStatus],
    0,
    0,
    'migrated_from_assignment',
    COALESCE(a.[consentRespondedAt], a.[createdAt])
FROM [dbo].[assignments] a
INNER JOIN [dbo].[tests] t ON t.[testId] = a.[testId]
WHERE a.[consentStatus] IN ('accepted', 'declined')
  AND t.[testCode] IN ('EPWORTH', 'PSQI', 'MUNICH');

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

