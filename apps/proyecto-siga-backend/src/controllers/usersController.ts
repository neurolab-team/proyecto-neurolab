import { asAdminOrPsychologist, asAdmin, asPsychologist } from "../middleware/auth";
import { auth } from "../middleware/auth";
import container from "../container/index";
import { CommonDtos } from "../shared/validators";
import { Router } from "express";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IUserService } from "../contracts/user/IuserService";
import { z } from "zod";
import { NotFound } from "../utils/httpError";
import { created } from "../utils/jsonResponse";
import {
  AssignPsychologistDto,
  CreateUserDto,
  PsychologistStudentResultsFiltersDto,
  ResendVerificationDto,
  RegisterDto,
  UpdateUserRoleDto,
} from "@packages/common-schemas/user.schemas";
import { userResponse } from "@packages/common-types/user.types";
import {
  registerRateLimiter,
  resendVerificationRateLimiter,
} from "../security/httpSecurity";

// Private Routes
export const UsersController = Router();
const userService = container.resolve<IUserService>("UserService");

UsersController.use(auth);
// Private Routes

UsersController.get(
  "/psychologist/students",
  asPsychologist,
  wrap(async (req: any, res) => {
    const students = await userService.getPsychologistStudents(req.user!.userId);
    return ok(res, students, "Listado de estudiantes asignados");
  })
);

UsersController.get(
  "/psychologist/students/results",
  asPsychologist,
  wrap(async (req: any, res) => {
    const filters = PsychologistStudentResultsFiltersDto.parse(req.query);
    const results = await userService.getPsychologistStudentResults(
      req.user!.userId,
      filters,
    );
    return ok(res, results, "Resultados de pruebas para exportacion");
  }),
);

UsersController.get(
  "/psychologist/students/:id",
  asPsychologist,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    const student = await userService.getPsychologistStudentById(
      req.user!.userId,
      id,
    );

    if (!student) {
      throw NotFound("Estudiante no encontrado");
    }

    return ok(res, student, "Detalle del estudiante asignado");
  })
);

UsersController.get(
  "/",
  asAdmin,
  wrap(async (req: any, res) => {
    const users = await userService.getUsers();
    return ok(res, users, "Listado de usuarios");
  })
);

UsersController.get(
  "/:id",
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    const user = await userService.getUserById(id);
    if (!user) {
      throw NotFound("Usuario no encontrado");
    }
    const userResponse: userResponse = {
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      isActive: user.isActive,
      gender: user.gender ?? "",
    };
    return ok(res, userResponse, "Detalle de usuario");
  })
);

UsersController.patch(
  "/:id/role",
  asAdmin,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    const input = UpdateUserRoleDto.parse(req.body);
    const user = await userService.updateUserRole(id, input);

    return ok(res, user, "Rol actualizado con exito");
  })
);

UsersController.patch(
  "/:id/psychologist",
  asAdmin,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    const input = AssignPsychologistDto.parse(req.body);
    const user = await userService.assignPsychologistToUser(
      id,
      input,
    );

    return ok(res, user, "Psicologo asignado con exito");
  })
);

UsersController.post(
  "/",
  asAdmin,
  wrap(async (req: any, res) => {
    const input = CreateUserDto.parse(req.body);
    const user = await userService.createUserByAdmin({
      email: input.email,
      name: input.name ?? "",
      userNumber: input.userNumber,
      role: input.role,
      userType: input.userType,
      birthDate: input.birthDate,
      gender: input.gender
    });
    const requiresPasswordChangeMessage =
      user.role === "psychologist" || user.role === "admin";

    const userReponse: userResponse = {
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      isActive: user.isActive,
      gender: user.gender ?? "",
      assignedPsychologistId: user.assignedPsychologistId ?? null,
      assignedPsychologist: user.assignedPsychologist ?? null,
      userId: user.userId,
      mustChangePassword: user.mustChangePassword,
      mustChangePasswordReason:
        requiresPasswordChangeMessage
          ? "Por seguridad institucional, debes reemplazar la contraseña temporal en tu primer inicio de sesión."
          : null,
    };

    const successMessage =
      requiresPasswordChangeMessage
        ? "Cuenta creada con éxito. Debe cambiar su contraseña temporal en el primer inicio de sesión."
        : "Usuario creado con éxito. Se ha enviado un email de verificación.";

    return created(
      res,
      userReponse,
      successMessage,
    );
  })
);

UsersController.patch(
  "/:id/deactivate",
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    await userService.deactivateUser(id);
    return ok(res, null, "Usuario desactivado con éxito");
  })
);

UsersController.patch(
  "/:id/activate",
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    await userService.activateUser(id);
    return ok(res, null, "Usuario activado con éxito");
  })
);

// Nueva ruta para verificar disponibilidad de email

UsersController.get(
  "/check-email/:email",
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const email = z.string().parse(req.params.email);
    const { excludeId } = z
      .object({ excludeId: z.string().optional() })
      .parse(req.query);

    const isAvailable = await userService.checkEmailAvailable(email, excludeId);
    return ok(
      res,
      { available: isAvailable, email },
      "Verificación de disponibilidad de email"
    );
  })
);

// Public Routes

const PublicUsersController = Router();

PublicUsersController.post(
  "/register",
  registerRateLimiter,
  wrap(async (req: any, res) => {
    const input = RegisterDto.parse(req.body);
    const user = await userService.createUser({
      email: input.email,
      name: input.name,
      userNumber: input.userNumber,
      userType: input.userType,
      birthDate: input.birthDate,
      gender: input.gender,
      password: input.password,
      role: "user", 
    });
    return created(
      res,
      { userId: user.userId, email: user.email },
      "Usuario registrado con éxito. Se ha enviado un email de verificación."
    );
  })
);

PublicUsersController.post(
  "/verify-email",
  wrap(async (req: any, res) => {
    const { token } = z.object({ token: z.string() }).parse(req.body);
    await userService.verifyEmail(token);
    return ok(
      res,
      null,
      "Email verificado exitosamente. Tu cuenta ha sido activada."
    );
  })
);

PublicUsersController.post(
  "/resend-verification",
  resendVerificationRateLimiter,
  wrap(async (req: any, res) => {
    const { email } = ResendVerificationDto.parse(req.body);
    await userService.resendVerificationEmail(email);
    return ok(
      res,
      null,
      "Si el correo existe y no está verificado, se envió un nuevo enlace.",
    );
  }),
);

PublicUsersController.post(
  "/check-unverified",
  wrap(async (req: any, res) => {
    const { email } = z.object({ email: z.string() }).parse(req.body);
    const isUnverified = await userService.checkUnverifiedAccount(email);
    return ok(res, { isUnverified }, "Verificación de cuenta");
  })
);

export { PublicUsersController };
