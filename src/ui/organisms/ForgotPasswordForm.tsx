import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForgotPassword } from '@hooks/AuthHooks';
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from '@schemas/loginSchema';
import { Button, Input } from '@/ui';

interface IProps {
  toggleModal: () => void;
}

export const ForgotPasswordForm = ({ toggleModal }: IProps) => {
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
          toggleModal();
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="email"
        label="Пошта"
        type="email"
        placeholder="Введіть пошту"
        register={register('email')}
        error={errors.email}
      />
      <Button type="submit" disabled={isSubmitting}>
        Надіслати лист
      </Button>
    </form>
  );
};
