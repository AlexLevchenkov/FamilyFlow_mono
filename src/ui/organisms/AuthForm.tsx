import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputCheckbox, Input } from '@/ui';
import { loginSchema, type LoginFormData } from '@schemas/loginSchema';
import { useLogin } from '@hooks/AuthHooks';
import { useStore } from '@/store';

export const LoginForm = () => {
  const login = useLogin();
  const { auth } = useStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: res => {
        auth.login({
          accessToken: res.data.data.accessToken,
          rememberMe: data.rememberMe,
          me: res.data.data.user,
        });
        navigate("/");
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("email", { type: "server", message: "Невірна пошта або пароль" });
            setError("password", { type: "server", message: "Невірна пошта або пароль" });
          }
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="email"
        label="Пошта"
        type="email"
        placeholder="Введи пошту"
        register={register('email')}
        error={errors.email}
      />
      <Input
        id="password"
        label="Пароль"
        type="password"
        placeholder="Введи пароль"
        register={register('password')}
        error={errors.password}
      />
      <InputCheckbox
        id="rememberMe"
        label="Залишатися авторизованим"
        register={register('rememberMe')}
      />
      <Button type="submit" disabled={isSubmitting}>
        Увійти
      </Button>
    </form>
  );
};
