import { ConsentStatus } from "./consent.types";

export type Assignment = {
    testId: string;
    status: string;
    assignmentId: string;
    assignedToId: string;
    consentStatus: ConsentStatus | string | null;
}
export type AssignmentWithTestsDataResponse = {
    assignmentId: string;
    test: {
        testId: string;
        testCode?: string | null;
        title: string;
        description?: string | null;
        questionCount?: number;
    };
    dueAt?: Date | null;
    startedAt?: Date | null;
    status: string;
    consentStatus?: ConsentStatus | string | null;
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
