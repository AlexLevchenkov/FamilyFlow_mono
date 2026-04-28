import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationSchema, type RegistrationData } from '@/schemas';
import { useRegistration } from '@/hooks/AuthHooks';
import { Button, Input, Popup } from '@/ui';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { isAxiosError } from 'axios';

export const RegistrationForm = () => {
  const [showSuccessfulPopup, setShowSuccessfulPopup] = useState(false);
  const registration = useRegistration();

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
      onSuccess: res => {
        if (res.status === 200) {
          setShowSuccessfulPopup(true);
        }
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          if (error.response?.status === 409) {
            setError('email', {type: 'service', message: 'Дана пошта вже зареєстрована'});
          }
        }
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Ім'я"
          type="name"
          placeholder="Введіть ваше ім'я"
          register={register('name')}
          error={errors.name}
        />

        <Input
          id="email"
          label="Пошта"
          type="email"
          placeholder="Введіть пошту"
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

        <Input
          id="repeatPassword"
          label="Повторіть пароль"
          type="password"
          placeholder="Повторіть пароль"
          register={register('repeatPassword')}
          error={errors.repeatPassword}
        />

        <Button type="submit" disabled={isSubmitting}>
          Зареєструватися
        </Button>
      </form>

      <NavLink className="mt-4" to="/login">Повернутися до авторизації</NavLink>

      <Popup
        isOpen={showSuccessfulPopup}
        onClose={() => setShowSuccessfulPopup(false)}
        showTime={3}
      >
        <p>Дякуємо за реєстрацію, на вашу пошту було надіслано лист для завершення реєстрації</p>
      </Popup>
    </>
  );
};
