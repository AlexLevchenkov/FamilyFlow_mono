import { Modal } from '@ui/atoms';
import { useNavigate } from 'react-router-dom';

interface IForgotPasswordModal {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const ForgotPasswordModal = ({
  isOpen,
  toggleOpen,
}: IForgotPasswordModal) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={toggleOpen}>
      <p className="text-base leading-relaxed text-page-copy">
        Ми надіслали лист із посиланням для відновлення пароля. Перейдіть за
        посиланням у листі, щоб продовжити.
      </p>
      <button
        className="mt-5 text-sm font-black text-background2"
        onClick={() => {
          toggleOpen();
          navigate('/login');
        }}
        type="button"
      >
        Повернутися до входу
      </button>
    </Modal>
  );
};
