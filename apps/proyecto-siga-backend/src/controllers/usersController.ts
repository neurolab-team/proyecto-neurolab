import { auth, asAdminOrPsychologist } from "../middleware/auth";
import container from "../container/index";
import { CommonDtos } from "../shared/validators";
import { Router } from "express";
import { wrap } from "../middleware/async";
import { ok } from "../utils/jsonResponse";
import { IUserService } from "../contracts/user/IuserService";
import { z } from "zod";
import { NotFound } from "../utils/httpError";
import { created } from "../utils/jsonResponse";

// Private Routes
export const UsersController = Router();
const userService = container.resolve<IUserService>("UserService");

UsersController.use(auth, asAdminOrPsychologist);
const role = ["user"] as const;
// const rolesAdmin = [..,admin, "psychologist", "user"] as const; // not implemented yet
interface userResponse {
  userNumber: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  gender: string;
}

const CreateUserDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  name: z.string().trim().optional().nullable(),
  role: z.enum(role),
  userNumber: z.string().min(1).trim(),
  gender: z.string(),
  password: z.string().min(6).optional()
});

const userTypes = ["itmStudent", "itmEmployee", "external"] as const;

const RegisterDto = z.object({
  email: z
    .string()
    .min(3)
    .trim()
    .transform((s) => s.toLowerCase()),
  name: z.string().min(1).trim(),
  userNumber: z.string().min(1).trim(),
  userType: z.enum(userTypes),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  password:z.string().min(6).optional()
});

// CRUD Routes using service

UsersController.get(
  "/",
  auth,
  asAdminOrPsychologist,
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
  asAdminOrPsychologist,
  wrap(async (req: any, res) => {
    const input = CreateUserDto.parse(req.body);
    const user = await userService.createUser({
      email: input.email,
      name: input.name ?? "",
      userNumber: input.userNumber,
      role: input.role,
      userType: "external",
      password: input.password ?? ""
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

// Routes public

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
    const { token,email } = z.object({ token: z.string(), email: z.string() }).parse(req.body);
    await userService.verifyEmail(token,email);
    return ok(
      res,
      null,
      "Email verificado exitosamente. Tu cuenta ha sido activada."
    );
  })
);

// PublicUsersController.post(
//   "/request-password-reset",
//   wrap(async (req: any, res) => {
//     const { email } = z.object({ email: z.string() }).parse(req.body);

//     await userService.requestPasswordReset(email);
//     return ok(
//       res,
//       null,
//       "Si el email existe, recibirás instrucciones para restablecer tu contraseña."
//     );
//   })
// );

// PublicUsersController.post(
//   "/reset-password",
//   wrap(async (req: any, res) => {
//     const { token, password } = z
//       .object({
//         token: z.string(),
//         password: z
//           .string()
//           .min(6, "La contraseña debe tener al menos 6 caracteres")
//           .regex(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//             "La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número"
//           ),
//       })
//       .parse(req.body);

//     await userService.resetPassword(token, password);
//     return ok(res, null, "Contraseña restablecida exitosamente.");
//   })
// );

// PublicUsersController.post(
//   "/resend-activation",
//   wrap(async (req: any, res) => {
//     const { email } = z.object({ email: z.string() }).parse(req.body);
//     await userService.resendActivation(email);
//     return ok(
//       res,
//       null,
//       "Si el email corresponde a una cuenta no activada, recibirás un nuevo email de activación."
//     );
//   })
// );

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
  "/check-unverified",
  wrap(async (req: any, res) => {
    const { email } = z.object({ email: z.string() }).parse(req.body);
    const isUnverified = await userService.checkUnverifiedAccount(email);
    return ok(res, { isUnverified }, "Verificación de cuenta");
  })
);

export { PublicUsersController };
