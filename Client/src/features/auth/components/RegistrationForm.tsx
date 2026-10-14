import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, type RegistrationData } from '@schemas';
import { useRegistration } from '@hooks/AuthHooks';
import { Button, Icon, Input, Popup } from '@ui';

export const RegistrationForm = () => {
  const [showSuccessfulPopup, setShowSuccessfulPopup] = useState(false);
  const registration = useRegistration();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegistrationData>({
    resolver: zodResolver(RegistrationSchema),
  });

  const onSubmit = (data: RegistrationData) => {
    registration.mutate(data, {
      onSuccess: () => setShowSuccessfulPopup(true),
      onError: (error) => {
        if (isAxiosError(error)) {
          if (error.response?.status === 409) {
            setError('email', { type: 'service', message: 'Дана пошта вже зареєстрована' });
          }
        }
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-4">
        <Input
          id="name"
          label="Ваше ім'я"
          icon="users"
          type="text"
          autoComplete="name"
          placeholder="Олексій Коваль"
          required
          register={register('name')}
          error={errors.name}
        />

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
          autoComplete="new-password"
          minLength={8}
          placeholder="Щонайменше 8 символів"
          required
          register={register('password')}
          error={errors.password}
        />

        <Input
          id="repeatPassword"
          label="Повторіть пароль"
          icon="lock"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Повторіть пароль"
          required
          register={register('repeatPassword')}
          error={errors.repeatPassword}
        />

        <label className="-mt-1 flex items-start gap-2 text-sm font-bold leading-normal text-page-copy">
          <input className="mt-0.5 size-4 shrink-0 accent-selected" required type="checkbox" />
          <span>
            Я погоджуюсь з умовами користування та політикою конфіденційності
          </span>
        </label>

        <Button type="submit" disabled={isSubmitting || registration.isPending}>
          Створити акаунт <Icon name="chevron" size={17} />
        </Button>
      </form>

      <button
        className="mt-4 text-sm font-black text-background2"
        onClick={() => navigate('/login')}
        type="button"
      >
        Повернутися до входу
      </button>

      <Popup
        isOpen={showSuccessfulPopup}
        onClose={() => setShowSuccessfulPopup(false)}
        showTime={3}
      >
        <div className="grid gap-4">
          <p className="text-sm leading-relaxed text-page-copy">
            Дякуємо за реєстрацію. На вашу пошту надіслано лист для завершення
            реєстрації.
          </p>
          <Button
            onClick={() => setShowSuccessfulPopup(false)}
            type="button"
          >
            Готово
          </Button>
        </div>
      </Popup>
    </>
  );
};
