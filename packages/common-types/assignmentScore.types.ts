import { Prisma } from "@prisma/client";

export interface AssignmentScore {
  assignmentId: string;
  totalScore: Prisma.Decimal;
  percentile?: Prisma.Decimal | null;
  interpretation?: string | null;
  details?: Prisma.JsonValue;
}

export interface CreateAssignmentScoreInput {
  assignmentId: string;
  totalScore: Prisma.Decimal;
  percentile?: Prisma.Decimal | null;
  interpretation?: string | null;
  details?: Prisma.JsonValue | Prisma.NullableJsonNullValueInput;
}


export interface SectionScore {
  sectionName: string;
  totalScore: number;
  interpretation: string;
}