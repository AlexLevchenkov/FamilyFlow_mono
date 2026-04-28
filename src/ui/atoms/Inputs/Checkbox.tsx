import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';

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
  error
}: IInputCheckbox) => {

  return (
    <div className="flex flex-row gap-1">
      <input
        id={id}
        {...register}
        type="checkbox"
        placeholder={placeholder}
        className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-lightText ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {label && <label htmlFor={id} className="text-sm leading-[1.5] font-medium">{label}</label>}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
