import { Icon } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@features/auth';

interface LogoutButtonProps {
  className?: string;
}

export const LogoutButton = ({ className = '' }: LogoutButtonProps) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const tryLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-extrabold text-lightText transition-all duration-150 ease-in-out hover:bg-background hover:text-background2 ${className}`}
      title="Вийти з акаунта"
      type="button"
      disabled={logout.isPending}
      onClick={tryLogout}
    >
      <Icon name="arrow" size={21} />
      <span>Вийти</span>
    </button>
  );
};
