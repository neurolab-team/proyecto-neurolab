export type Assignment = {
    testId: string;
    status: string;
    assignmentId: string;
    assignedToId: string;
}
export type AssignmentWithTestsDataResponse = {
    assignmentId: string;
    test: {
        testId: string;
        title: string;
        description?: string | null;
    };
    dueAt?: Date | null;
    startedAt?: Date | null;
    status: string;
}

export type PsychologistAssignableTest = {
    testId: string;
    title: string;
};

export type BulkAssignPsychologistTestInput = {
    testId: string;
    studentIds: string[];
    dueAt?: string;
};

export type BulkAssignPsychologistTestResult = {
    totalRequested: number;
    createdCount: number;
    duplicateCount: number;
    unauthorizedCount: number;
    createdStudentIds: string[];
    duplicateStudentIds: string[];
    unauthorizedStudentIds: string[];
};
