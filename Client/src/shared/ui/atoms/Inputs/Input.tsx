import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useToggle } from '@lib/useToggle';
import { Icon } from '../Icon';
import type { IconName } from '../../../types/index';

interface IInput {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: IconName;
  minLength?: number;
  required?: boolean;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  icon,
  minLength,
  required,
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
    <div className="grid gap-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-black text-page-label">
          {label}
        </label>
      )}
      <div className={`relative flex h-[52px] items-center pl-3 rounded-[14px] border bg-panelsColor text-page-faint transition duration-150 focus-within:border-page-focus focus-within:bg-white focus-within:shadow-[0_0_0_4px_var(--color-page-focus-soft)] focus-within:text-selected ${error ? 'border-red-500 focus-within:border-red-500' : 'border-page-border'}`}>
        {icon && <Icon name={icon} size={19} />}
        <input
          {...register}
          id={id}
          type={currentType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-base font-bold text-page-heading outline-none placeholder:font-semibold placeholder:text-page-placeholder"
        />
        {type === 'password' && (
          <button
            aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
            className="py-2.5 pr-4 pl-1 text-page-faint"
            onClick={togglePassword}
            type="button"
          >
            <Icon name="eye" size={19} />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error.message}</p>}
    </div>
  );
};
