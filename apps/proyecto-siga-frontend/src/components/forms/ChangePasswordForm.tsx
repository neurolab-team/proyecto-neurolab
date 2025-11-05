import { useForm } from "react-hook-form";
// 1. Importa Zod y el resolver
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordData,
} from "@packages/common-types/auth.schemas";
// 2. Importa el hook de mutación
import { useChangePasswordMutation } from "@/services/api/auth";

interface ChangePasswordFormProps {
  accessToken: string;
  onSuccess: () => void;
}

export function ChangePasswordForm({
  accessToken,
  onSuccess,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useChangePasswordMutation();

  const onSubmit = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(
      {
        newPassword: data.password,
        accessToken: accessToken,
      },
      {
        onSuccess: onSuccess,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Nueva Contraseña</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label>Confirmar Nueva Contraseña</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* ... Tu botón de submit y manejo de error de la mutación ... */}
      <button type="submit" disabled={changePasswordMutation.isPending}>
        {changePasswordMutation.isPending
          ? "Cambiando..."
          : "Cambiar Contraseña"}
      </button>
    </form>
  );
}
