import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@hooks/AuthHooks';
import { loginSchema, type LoginFormData } from '@schemas/loginSchema';
import { useStore } from '@store';
import { Button, InputCheckbox, Input, Icon } from '@ui';

export const LoginForm = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const { auth } = useStore();

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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-4">
      <Input
        id="email"
        label="Електронна пошта"
        icon="mail"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        required
        register={register('email')}
        error={errors.email}
      />
      <Input
        id="password"
        label="Пароль"
        icon="lock"
        type="password"
        autoComplete="current-password"
        minLength={8}
        placeholder="Щонайменше 8 символів"
        required
        register={register('password')}
        error={errors.password}
      />
      <div className="-mt-1 flex items-center justify-between">
        <InputCheckbox
          id="rememberMe"
          label="Запам'ятати мене"
          register={register('rememberMe')}
        />
        <button
          className="text-xs font-black text-background2"
          onClick={() => navigate("/reset-password")}
          type="button"
        >
          Забули пароль?
        </button>
      </div>
      <Button type="submit" disabled={isSubmitting || login.isPending}>
        Увійти <Icon name="chevron" size={17} />
      </Button>
    </form>
  );
};
