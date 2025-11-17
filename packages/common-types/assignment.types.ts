export type Assignment = {
    testId: string;
    status: string;
    assignmentId: string;
}
export type AssignmentWithTestsDataResponse = {
    assignmentId: string;
    test: {
        testId: string;
        title: string;
    };
    dueAt?: Date | null;
    startedAt?: Date | null;
    status: string;
}