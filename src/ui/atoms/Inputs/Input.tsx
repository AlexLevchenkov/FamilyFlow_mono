import { useToggle } from '@/hooks/useToggle';
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import Eye from '@assets/SVG/Eye.svg';
import Eye_closed from '@assets/SVG/Eye-closed.svg';

interface IInput {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  error,
}: IInput) => {
  const [showPassword, toggle] = useToggle();
  const togglePassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    toggle();
  };

  const currentType =
    type != 'password' ? type : showPassword ? 'text' : 'password';

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...register}
          id={id}
          type={currentType}
          placeholder={placeholder}
          className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-lightText ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {type === 'password' && (
          <button
            className="p-1.5 absolute w-8 right-2.5 top-1/2 -translate-y-1/2"
            onClick={togglePassword}
          >
            <img
              src={showPassword ? Eye : Eye_closed}
              alt={showPassword ? 'hide password' : 'show password'}
            />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};
