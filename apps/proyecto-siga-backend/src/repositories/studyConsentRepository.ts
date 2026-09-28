import prisma from "@packages/libs/prisma";
import { studyConsent } from "@packages/libs/prisma";
import { StudyCode } from "@packages/common-types/consent.types";
import {
  CreateStudyConsentData,
  IStudyConsentRepo,
} from "../contracts/studyConsent/IstudyConsentRepo";

export class StudyConsentRepository implements IStudyConsentRepo {
  findLatest(userId: string, studyCode: StudyCode): Promise<studyConsent | null> {
    return prisma.studyConsent.findFirst({
      where: { userId, studyCode },
      orderBy: { respondedAt: "desc" },
    });
  }

  create(data: CreateStudyConsentData): Promise<studyConsent> {
    return prisma.studyConsent.create({ data: { ...data, source: "user" } });
  }
}
