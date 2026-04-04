import { inject, injectable } from "tsyringe";
import {
  PsychologistStudentProfile,
  PsychologistStudentSummary,
} from "@packages/common-types/psychologist.types";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import {
  buildStudentProfile,
  buildStudentSummary,
} from "./student-summary.mapper";

@injectable()
export class PsychologistStudentsQueryService {
  constructor(
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
  ) {}

  async getPsychologistStudents(
    psychologistId: string,
  ): Promise<PsychologistStudentSummary[]> {
    const students =
      await this.userRepo.findAssignedStudentsByPsychologistId(psychologistId);

    return students.map((student) => buildStudentSummary(student));
  }

  async getPsychologistStudentById(
    psychologistId: string,
    studentId: string,
  ): Promise<PsychologistStudentProfile | null> {
    const student = await this.userRepo.findAssignedStudentById(
      psychologistId,
      studentId,
    );

    return student ? buildStudentProfile(student) : null;
  }
}
