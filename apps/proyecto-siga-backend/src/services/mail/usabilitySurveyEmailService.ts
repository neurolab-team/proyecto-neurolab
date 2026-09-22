import { inject, injectable } from "tsyringe";
import { IMailService } from "../../contracts/mail/ImailService";
import { IUsabilitySurveyEmailService } from "../../contracts/mail/IusabilitySurveyEmailService";
import { USABILITY_SURVEY_URL } from "@packages/common-types/usabilitySurvey.types";

@injectable()
export class UsabilitySurveyEmailService implements IUsabilitySurveyEmailService {
  constructor(
    @inject("MailService")
    private readonly mailService: IMailService,
  ) {}

  async sendUsabilitySurveyEmail(email: string, name: string): Promise<void> {
    await this.mailService.sendTemplate(
      email,
      "Ayúdanos a mejorar Neurolab: encuesta de usabilidad",
      "usability-survey",
      { name, surveyUrl: USABILITY_SURVEY_URL },
    );
  }
}
