BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [userId] UNIQUEIDENTIFIER NOT NULL,
    [userNumber] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000),
    [name] NVARCHAR(1000) NOT NULL,
    [gender] NVARCHAR(1000),
    [birthDate] DATETIME2,
    [userType] NVARCHAR(1000) NOT NULL CONSTRAINT [user_userType_df] DEFAULT 'external',
    [role] NVARCHAR(1000) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [user_isActive_df] DEFAULT 0,
    [lastLogin] DATETIME2,
    [passwordChangedAt] DATETIME2,
    [mustChangePassword] BIT NOT NULL CONSTRAINT [user_mustChangePassword_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [verifiedEmail] BIT NOT NULL CONSTRAINT [user_verifiedEmail_df] DEFAULT 0,
    [assignedPsychologistId] UNIQUEIDENTIFIER,
    [assignedPsychologistAt] DATETIME2,
    [followUpAt] DATETIME2,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([userId]),
    CONSTRAINT [user_userNumber_key] UNIQUE NONCLUSTERED ([userNumber]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[tests] (
    [testId] UNIQUEIDENTIFIER NOT NULL,
    [testCode] NVARCHAR(1000),
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [isPublished] BIT NOT NULL CONSTRAINT [tests_isPublished_df] DEFAULT 0,
    [createdById] UNIQUEIDENTIFIER,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [tests_pkey] PRIMARY KEY CLUSTERED ([testId]),
    CONSTRAINT [tests_testCode_key] UNIQUE NONCLUSTERED ([testCode])
);

-- CreateTable
CREATE TABLE [dbo].[testSections] (
    [testSectionId] UNIQUEIDENTIFIER NOT NULL,
    [testSectionCode] NVARCHAR(1000),
    [testId] UNIQUEIDENTIFIER NOT NULL,
    [name] NVARCHAR(1000),
    CONSTRAINT [testSections_pkey] PRIMARY KEY CLUSTERED ([testSectionId])
);

-- CreateTable
CREATE TABLE [dbo].[questions] (
    [questionId] UNIQUEIDENTIFIER NOT NULL,
    [testId] UNIQUEIDENTIFIER NOT NULL,
    [testSectionId] UNIQUEIDENTIFIER,
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [questions_type_df] DEFAULT 'single_choice',
    [code] NVARCHAR(1000),
    [prompt] NVARCHAR(1000) NOT NULL,
    [required] BIT NOT NULL CONSTRAINT [questions_required_df] DEFAULT 1,
    [metadata] NVARCHAR(1000),
    [condition] NVARCHAR(1000),
    CONSTRAINT [questions_pkey] PRIMARY KEY CLUSTERED ([questionId]),
    CONSTRAINT [questions_testId_code_key] UNIQUE NONCLUSTERED ([testId],[code])
);

-- CreateTable
CREATE TABLE [dbo].[questionsOptions] (
    [questionOptionId] UNIQUEIDENTIFIER NOT NULL,
    [questionId] UNIQUEIDENTIFIER NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [value] NVARCHAR(1000),
    [scoreValue] DECIMAL(10,2),
    CONSTRAINT [questionsOptions_pkey] PRIMARY KEY CLUSTERED ([questionOptionId])
);

-- CreateTable
CREATE TABLE [dbo].[assignments] (
    [assignmentId] UNIQUEIDENTIFIER NOT NULL,
    [testId] UNIQUEIDENTIFIER NOT NULL,
    [assignedToId] UNIQUEIDENTIFIER NOT NULL,
    [assignedById] UNIQUEIDENTIFIER NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [assignments_status_df] DEFAULT 'assigned',
    [dueAt] DATETIME2,
    [startedAt] DATETIME2,
    [completedAt] DATETIME2,
    [reviewedAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [assignments_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [assignments_pkey] PRIMARY KEY CLUSTERED ([assignmentId]),
    CONSTRAINT [assignments_assignedToId_testId_key] UNIQUE NONCLUSTERED ([assignedToId],[testId])
);

-- CreateTable
CREATE TABLE [dbo].[answers] (
    [answerId] UNIQUEIDENTIFIER NOT NULL,
    [assignmentId] UNIQUEIDENTIFIER NOT NULL,
    [questionId] UNIQUEIDENTIFIER NOT NULL,
    [questionOptionId] UNIQUEIDENTIFIER,
    [textValue] NVARCHAR(1000),
    CONSTRAINT [answers_pkey] PRIMARY KEY CLUSTERED ([answerId]),
    CONSTRAINT [answers_assignmentId_questionId_key] UNIQUE NONCLUSTERED ([assignmentId],[questionId])
);

-- CreateTable
CREATE TABLE [dbo].[assignmentScores] (
    [assignmentId] UNIQUEIDENTIFIER NOT NULL,
    [totalScore] DECIMAL(12,4) NOT NULL,
    [percentile] DECIMAL(6,3),
    [attentionLevel] NVARCHAR(1000) NOT NULL CONSTRAINT [assignmentScores_attentionLevel_df] DEFAULT 'none',
    [interpretation] NVARCHAR(1000),
    [details] NVARCHAR(1000),
    CONSTRAINT [assignmentScores_pkey] PRIMARY KEY CLUSTERED ([assignmentId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [user_assignedPsychologistId_idx] ON [dbo].[user]([assignedPsychologistId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assignments_assignedToId_status_idx] ON [dbo].[assignments]([assignedToId], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [assignmentScores_attentionLevel_idx] ON [dbo].[assignmentScores]([attentionLevel]);

-- AddForeignKey
ALTER TABLE [dbo].[user] ADD CONSTRAINT [user_assignedPsychologistId_fkey] FOREIGN KEY ([assignedPsychologistId]) REFERENCES [dbo].[user]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tests] ADD CONSTRAINT [tests_createdById_fkey] FOREIGN KEY ([createdById]) REFERENCES [dbo].[user]([userId]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[testSections] ADD CONSTRAINT [testSections_testId_fkey] FOREIGN KEY ([testId]) REFERENCES [dbo].[tests]([testId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[questions] ADD CONSTRAINT [questions_testSectionId_fkey] FOREIGN KEY ([testSectionId]) REFERENCES [dbo].[testSections]([testSectionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[questions] ADD CONSTRAINT [questions_testId_fkey] FOREIGN KEY ([testId]) REFERENCES [dbo].[tests]([testId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[questionsOptions] ADD CONSTRAINT [questionsOptions_questionId_fkey] FOREIGN KEY ([questionId]) REFERENCES [dbo].[questions]([questionId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assignments] ADD CONSTRAINT [assignments_assignedById_fkey] FOREIGN KEY ([assignedById]) REFERENCES [dbo].[user]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assignments] ADD CONSTRAINT [assignments_assignedToId_fkey] FOREIGN KEY ([assignedToId]) REFERENCES [dbo].[user]([userId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assignments] ADD CONSTRAINT [assignments_testId_fkey] FOREIGN KEY ([testId]) REFERENCES [dbo].[tests]([testId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[answers] ADD CONSTRAINT [answers_questionId_fkey] FOREIGN KEY ([questionId]) REFERENCES [dbo].[questions]([questionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[answers] ADD CONSTRAINT [answers_questionOptionId_fkey] FOREIGN KEY ([questionOptionId]) REFERENCES [dbo].[questionsOptions]([questionOptionId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[answers] ADD CONSTRAINT [answers_assignmentId_fkey] FOREIGN KEY ([assignmentId]) REFERENCES [dbo].[assignments]([assignmentId]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[assignmentScores] ADD CONSTRAINT [assignmentScores_assignmentId_fkey] FOREIGN KEY ([assignmentId]) REFERENCES [dbo].[assignments]([assignmentId]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
