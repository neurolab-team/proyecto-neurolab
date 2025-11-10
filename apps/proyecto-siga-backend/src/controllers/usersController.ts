import { auth, asAdminOrPsychologist, asAdmin } from "../middleware/auth";
import container from "../container/index";
import { CommonDtos } from "../shared/validators";
import { Router } from "express";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IUserService } from "../contracts/user/IuserService";
import { z } from "zod";
import { NotFound } from "../utils/httpError";
import { created } from "../utils/jsonResponse";
import { CreateUserDto, RegisterDto } from "@packages/common-schemas/user.schemas";
import { userResponse } from "@packages/common-types/user.types";
// Private Routes
export const UsersController = Router();
const userService = container.resolve<IUserService>("UserService");

UsersController.use(auth, asAdminOrPsychologist);



// Private Routes

UsersController.get(
  "/",
  auth,
  asAdmin,
  wrap(async (req: any, res) => {
    const users = await userService.getUsers();
    return ok(res, users, "Listado de usuarios");
  })
);

UsersController.get(
  "/:id",
  auth,
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

UsersController.post(
  "/",
  auth,
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
    const userReponse: userResponse = {
      userNumber: user.userNumber,
      email: user.email,
      name: user.name || "",
      role: user.role,
      isActive: user.isActive,
      gender: user.gender ?? "",
    };
    return created(
      res,
      userReponse,
      "Usuario creado con éxito. Se ha enviado un email de verificación."
    );
  })
);

UsersController.patch(
  "/:id/deactivate",
  auth,
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const { id } = CommonDtos.IdParam.parse(req.params);
    await userService.deactivateUser(id);
    return ok(res, null, "Usuario desactivado con éxito");
  })
);

UsersController.patch(
  "/:id/activate",
  auth,
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
      role: "user", // 🔒 SEGURIDAD: Siempre forzar role 'user' en registro público
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
  "/check-unverified",
  wrap(async (req: any, res) => {
    const { email } = z.object({ email: z.string() }).parse(req.body);
    const isUnverified = await userService.checkUnverifiedAccount(email);
    return ok(res, { isUnverified }, "Verificación de cuenta");
  })
);

export { PublicUsersController };
