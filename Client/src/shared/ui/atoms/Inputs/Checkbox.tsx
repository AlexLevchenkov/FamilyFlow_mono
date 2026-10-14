import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface IInputCheckbox {
  id: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export const InputCheckbox = ({
  id,
  label,
  placeholder,
  register,
  error,
}: IInputCheckbox) => {
  return (
    <div className="grid gap-1">
      <div className="flex items-start gap-2 text-sm font-bold leading-normal text-page-copy">
        <input
          id={id}
          {...register}
          type="checkbox"
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`mt-0.5 size-4 shrink-0 accent-selected ${error ? 'outline outline-1 outline-red-500' : ''}`}
        />
        {label && (
          <label htmlFor={id}>
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error.message}</p>}
    </div>
  );
};
