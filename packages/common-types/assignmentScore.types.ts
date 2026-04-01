import { PsychologistPriority } from "./psychologist.types";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

export type AttentionLevel = PsychologistPriority | "none";
export type JsonObject = {
  [key: string]: JsonValue | undefined;
};

export interface JsonArray extends Array<JsonValue> {}

export interface AssignmentScore {
  assignmentId: string;
  totalScore: number;
  percentile?: number | null;
  attentionLevel: AttentionLevel;
  interpretation?: string | null;
  details?: JsonValue;
}

export interface CreateAssignmentScoreInput {
  assignmentId: string;
  totalScore: number;
  percentile?: number | null;
  attentionLevel?: AttentionLevel;
  interpretation?: string | null;
  details?: JsonValue;
}

export interface SectionScore {
  sectionName: string;
  totalScore: number;
  interpretation: string;
  attentionLevel: AttentionLevel;
}