import { Modal } from '@ui/atoms';
import { NavLink } from 'react-router-dom';

interface IForgotPasswordModal {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const ForgotPasswordModal = ({
  isOpen,
  toggleOpen,
}: IForgotPasswordModal) => {
  return (
    <Modal isOpen={isOpen} onClose={toggleOpen}>
      <p>
        Ми надіслали на вказану вами пошту лист, будь ласка перейдіть по
        посиланню у цьому листі для зміни пароля до вашого аккаунта
      </p>

      <NavLink className="underline" to={'/login'}>Певернутися до авторизації</NavLink>
    </Modal>
  );
};
