import { useToggle } from '@hooks/useToggle';
import { ForgotPasswordForm, ForgotPasswordModal, LoginForm } from '@/ui';

export const ForgotPasswordPage = () => {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <main className="h-screen flex flex-col justify-center">
        <div className="flex justify-center gap-5 py-8">
          <div className="flex-col justify-center bg-white shadow-lg p-10 hidden lg:flex lg:w-3/7 lg:px-10">
            <h2 className="text-4xl mb-2">Увійти</h2>
            <LoginForm />
          </div>
          <div className="w-3/4 lg:w-3/7 flex-col items-center justify-center bg-white shadow-lg p-10">
            <h1 className="text-4xl mb-2">Забули пароль?</h1>
            <p>
              Будь ласка введіть свою адресу електронної пошту, і ми надішлемо
              вам посилання для оновлення пароля
            </p>
            <ForgotPasswordForm toggleModal={toggleOpen} />
          </div>
        </div>
        <ForgotPasswordModal isOpen={isOpen} toggleOpen={toggleOpen} />
      </main>
    </>
  );
};
