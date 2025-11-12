import { IAssignmentService } from "../../contracts/assignment/IassignmentService";
import { inject, injectable } from "tsyringe";
import { IAssignmentRepo } from "../../contracts/assignment/IassignmentRepo";
import { ITestRepo } from "../../contracts/test/ItestRepo";
import { TestDataResponse } from "@packages/common-schemas/test.schemas";
import { NotFound } from "../../utils/httpError";

@injectable()
export class AssignmentService implements IAssignmentService {
  constructor(
    @inject("AssignmentRepo")
    private readonly assignmentRepo: IAssignmentRepo,
    @inject("TestRepo")
    private readonly testRepo: ITestRepo,
  ) {}
  
  async getAssignmentById(assignmentId: string): Promise<TestDataResponse | null> {
    const assignment =
      await this.assignmentRepo.getAssignmentForId(assignmentId);
    if (!assignment) {
      throw NotFound("Asignacion no encontrada");
    }
    if (assignment.status === "completed") {
      throw NotFound("La asignacion ya fue completada");
    }
    const test = await this.testRepo.getTestWithQuestionsById(assignment.testId);

    if (!test) {
      throw NotFound("Test no encontrado para la asignacion");
    }
    if(!test.questions){
      throw NotFound("El test no tiene preguntas asociadas");
    }
    const formattedData: TestDataResponse = {
      title: test.title,
      questions: test.questions.map(q => ({
        id: q.questionId,
        code: q.code ?? null,
        prompt: q.prompt ?? "",
      options: q.questionOption.map(opt => ({
        id: opt.questionOptionId,
        label: opt.label,
        value: opt.value ?? null,
      })),
    })),
  };
    return formattedData;
  }
}
