import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@hooks/AuthHooks';
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from '@schemas/loginSchema';
import { Button, Input } from '@ui';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Icon } from '@ui';

export const ForgotPasswordForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPassword.mutate(data, {
      onSuccess: res => {
        if (res.status === 200) {
          setShowSuccess(true);
        }
      },
    });
  };

  return (
    <>
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
        <Button type="submit" disabled={isSubmitting || forgotPassword.isPending}>
          Надіслати лист <Icon name="chevron" size={17} />
        </Button>
      </form>
      <ForgotPasswordModal
        isOpen={showSuccess}
        toggleOpen={() => setShowSuccess(false)}
      />
    </>
  );
};
