import { inject, injectable } from "tsyringe";
import {
  PsychologistDashboardFeed,
  PsychologistDashboardStats,
} from "@packages/common-types/psychologist.types";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import {
  getAssignmentActivityDate,
  getAssignmentPriority,
  getPriorityReason,
  getPriorityWeight,
} from "./case.rules";

@injectable()
export class PsychologistDashboardQueryService {
  constructor(
    @inject("AssignmentRepo")
    private readonly assignmentRepo: IAssignmentRepo,
  ) {}

  async getDashboardStats(
    psychologistId: string,
  ): Promise<PsychologistDashboardStats> {
    return this.assignmentRepo.getDashboardStats(psychologistId);
  }

  async getDashboardFeed(
    psychologistId: string,
  ): Promise<PsychologistDashboardFeed> {
    const [priorityRecords, recentActivity] = await Promise.all([
      this.assignmentRepo.getDashboardPriorityCases(psychologistId),
      this.assignmentRepo.getDashboardRecentActivity(psychologistId),
    ]);

    const priorityCases = priorityRecords
      .map((record) => {
        const priority = getAssignmentPriority({
          status: record.status,
          reviewedAt: record.reviewedAt,
          score: record.score,
        });

        return {
          record,
          priority,
          reason: getPriorityReason({
            status: record.status,
            reviewedAt: record.reviewedAt,
            score: record.score,
          }),
        };
      })
      .sort((left, right) => {
        const priorityDelta =
          getPriorityWeight(right.priority) - getPriorityWeight(left.priority);

        if (priorityDelta !== 0) return priorityDelta;

        return (
          getAssignmentActivityDate(right.record).getTime() -
          getAssignmentActivityDate(left.record).getTime()
        );
      })
      .slice(0, 8)
      .map(({ record, priority, reason }) => ({
        studentId: record.assignedTo.userId,
        studentName: record.assignedTo.name || record.assignedTo.email,
        testTitle: record.test.title,
        status: record.status,
        priority,
        reason,
        interpretation: record.score?.interpretation || null,
        completedAt: record.completedAt ? record.completedAt.toISOString() : null,
      }));

    return { priorityCases, recentActivity };
  }
}
