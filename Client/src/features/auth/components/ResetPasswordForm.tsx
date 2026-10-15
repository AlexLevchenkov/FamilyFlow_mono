import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@ui';
import {
  resetPasswordSchema,
  type ResetPasswordData,
} from '@schemas/loginSchema';
import { useResetPassword } from '@hooks/AuthHooks';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@ui';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useResetPassword();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordData) => {
    resetPassword.mutate(
      { token, newPassword: data.newPassword },
      { onSuccess: () => navigate('/login') }
    );
  };

  return (
    <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="newPassword"
        label="Новий пароль"
        icon="lock"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Щонайменше 8 символів"
        required
        register={register('newPassword')}
        error={errors.newPassword}
      />
      <Input
        id="confirmPassword"
        label="Повторіть новий пароль"
        icon="lock"
        type="password"
        autoComplete="new-password"
        minLength={8}
        placeholder="Введіть пароль ще раз"
        required
        register={register('confirmPassword')}
        error={errors.confirmPassword}
      />
      {resetPassword.isError && (
        <p className="text-sm text-red-600" role="alert">
          Не вдалося оновити пароль. Можливо, посилання недійсне або строк його
          дії минув.
        </p>
      )}
      <Button type="submit" disabled={isSubmitting || resetPassword.isPending}>
        Оновити пароль <Icon name="chevron" size={17} />
      </Button>
    </form>
  );
}
