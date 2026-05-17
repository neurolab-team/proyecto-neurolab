import { inject, injectable } from "tsyringe";
import { Prisma } from "@packages/libs/prisma";
import { NotFound } from "../../utils/httpError";
import { IVerificationService } from "../../contracts/verification/IverificationService";
import { IUserRepo } from "../../contracts/user/IuserRepo";
import { IEmailVerificationService } from "../../contracts/mail/IemailVerificationService";
import { TransactionManager } from "../transaction/transactionManager";

@injectable()
export class UserVerificationService {
  constructor(
    @inject("VerificationService")
    private readonly verificationService: IVerificationService,
    @inject("UserRepo")
    private readonly userRepo: IUserRepo,
    @inject("EmailVerificationService")
    private readonly emailVerificationService: IEmailVerificationService,
    @inject("TransactionManager")
    private readonly txManager: TransactionManager,
  ) {}

  private async assignPsychologistAutomatically(
    userId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const candidates = await this.userRepo.findActivePsychologistsWithStudentsCount(tx);
    const selectedPsychologist = candidates[0];

    if (!selectedPsychologist) {
      return;
    }

    await this.userRepo.update(
      userId,
      {
        assignedPsychologistAt: new Date(),
        assignedPsychologist: {
          connect: {
            userId: selectedPsychologist.userId,
          },
        },
      },
      tx,
    );
  }

  async verifyEmail(token: string): Promise<void> {
    const email = await this.verificationService.resolveVerificationEmail(token);

    await this.txManager.run(
      async (tx) => {
        const user = await this.userRepo.findByEmail(email, tx);

        if (!user) {
          throw NotFound("Usuario no encontrado para verificación");
        }

        if (!user.verifiedEmail) {
          await this.userRepo.update(
            user.userId,
            {
              verifiedEmail: true,
              isActive: true,
            },
            tx,
          );

          const canAutoAssign = user.role === "user" && !user.assignedPsychologistId;
          if (canAutoAssign) {
            await this.assignPsychologistAutomatically(user.userId, tx);
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    await this.verificationService.consumeVerificationToken(token);
  }

  async checkUnverifiedAccount(email: string): Promise<boolean> {
    const user = await this.userRepo.findByEmail(email.toLowerCase());
    return user ? !user.verifiedEmail : false;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    if (!user || user.verifiedEmail) {
      return;
    }

    const verificationToken = await this.verificationService.createVerificationToken(normalizedEmail);
    const verificationUrl = `${process.env.APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await this.emailVerificationService.sendVerificationEmailUser(
      normalizedEmail,
      user.name || "Usuario",
      verificationUrl,
    );
  }
}
