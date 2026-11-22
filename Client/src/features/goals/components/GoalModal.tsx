import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Input, PrimaryButton, Icon } from '@ui';
import type { CreateGoalBody, GoalModel, GoalType, UpdateGoalBody } from '@types';
import { createGoalFormSchema, type CreateGoalFormData } from '../schemas';
import {
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
} from '../hooks';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: GoalModel | null;
}

const TYPE_OPTIONS: Array<{
  type: GoalType;
  label: string;
  icon: 'target' | 'check' | 'sun';
  color: string;
}> = [
  { type: 'AMOUNT', label: 'Фінансова', icon: 'target', color: '#7656d0' },
  { type: 'COUNTER', label: 'Лічильник', icon: 'check', color: '#e87891' },
  { type: 'STEPS', label: 'Покрокова', icon: 'sun', color: '#39b29d' },
];

const CURRENCY_OPTIONS = [
  { value: 'UAH', label: '₴ Гривня' },
  { value: 'USD', label: '$ Долар' },
  { value: 'EUR', label: '€ Євро' },
];

function formatDateForInput(date?: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function GoalModal({ isOpen, onClose, goal }: GoalModalProps) {
  const isEditMode = Boolean(goal);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: createGoal, isPending: isCreating } = useCreateGoalMutation();
  const { mutate: updateGoal, isPending: isUpdating } = useUpdateGoalMutation();
  const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoalMutation();

  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalFormSchema),
    defaultValues: {
      type: 'AMOUNT',
      currency: 'UAH',
      currentValue: 0,
    },
  });

  const selectedType = watch('type');
  const selectedCurrency = watch('currency');
  const targetValue = watch('targetValue');
  const currentValue = watch('currentValue');

  // Опція Б: Автоматичне обрізання (auto-clamp) currentValue до targetValue
  useEffect(() => {
    const targetNum = Number(targetValue);
    const currentNum = Number(currentValue);

    if (!isNaN(targetNum) && targetNum > 0 && !isNaN(currentNum)) {
      if (currentNum > targetNum) {
        setValue('currentValue', targetNum, { shouldValidate: true });
      }
    }
  }, [targetValue, currentValue, setValue]);

  useEffect(() => {
    setIsConfirmingDelete(false);

    if (goal) {
      reset({
        title: goal.title,
        type: goal.type,
        targetValue: goal.targetValue ?? undefined,
        currentValue: goal.currentValue ?? 0,
        dueDate: formatDateForInput(goal.dueDate),
        currency: goal.currency || 'UAH',
        unit: goal.unit || '',
        description: goal.description || '',
      });
    } else {
      reset({
        title: '',
        type: 'AMOUNT',
        targetValue: undefined,
        currentValue: 0,
        dueDate: '',
        currency: 'UAH',
        unit: '',
        description: '',
      });
    }
  }, [goal, isOpen, reset]);

  const handleClose = () => {
    setIsConfirmingDelete(false);
    reset();
    onClose();
  };

  const onSubmit = (data: CreateGoalFormData) => {
    if (isEditMode && goal) {
      const payload: UpdateGoalBody = {
        title: data.title.trim(),
        status: goal.status || 'ACTIVE',
        currentValue: Number(data.currentValue ?? 0),
        targetValue: Number(data.targetValue),
        dueDate: new Date(data.dueDate),
        description: data.description?.trim() || null,
        currency: goal.type === 'AMOUNT' ? data.currency || 'UAH' : null,
        unit: goal.type !== 'AMOUNT' ? data.unit?.trim() || null : null,
      };

      updateGoal(
        { id: goal.id, dto: payload },
        {
          onSuccess: handleClose,
        }
      );
    } else {
      const payload: CreateGoalBody = {
        title: data.title.trim(),
        type: data.type,
        status: 'ACTIVE',
        currentValue: Number(data.currentValue ?? 0),
        targetValue: Number(data.targetValue),
        startsAt: new Date(),
        dueDate: new Date(data.dueDate),
        description: data.description?.trim() || null,
        currency: data.type === 'AMOUNT' ? data.currency || 'UAH' : null,
        unit: data.type !== 'AMOUNT' ? data.unit?.trim() || null : null,
      };

      createGoal(payload, {
        onSuccess: handleClose,
      });
    }
  };

  const handleDelete = () => {
    if (!goal) return;
    deleteGoal(goal.id, {
      onSuccess: handleClose,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {isEditMode ? 'Редагування цілі' : 'Нова сімейна ціль'}
          </h2>
          <p className="mt-1 text-sm text-lightText">
            {isEditMode
              ? 'Оновіть прогрес, дедлайн або опис вашої цілі.'
              : 'Визначте спільну мету, до якої ви будете рухатися разом.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Тип цілі */}
          <div>
            <label className="block text-sm font-black text-text mb-2">
              Тип цілі
            </label>

            {isEditMode ? (
              // В режимі редагування тип зафіксований (Опція 2.1)
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-sm font-bold text-lightText">
                <Icon name="lock" size={17} />
                <span>
                  {TYPE_OPTIONS.find(o => o.type === selectedType)?.label ||
                    selectedType}
                </span>
                <span className="text-xs font-normal text-textPlaceholder">
                  (тип зафіксовано)
                </span>
              </div>
            ) : (
              // При створенні — вільний вибір типу
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map(opt => {
                  const isSelected = selectedType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setValue('type', opt.type)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border py-2.5 px-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-primary bg-primarySoft text-primary shadow-sm'
                          : 'border-border bg-panelsColor text-lightText hover:border-borderHover hover:text-text'
                      }`}
                    >
                      <Icon name={opt.icon} size={18} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {errors.type && (
              <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Назва цілі */}
          <Input
            id="title"
            label="Назва цілі"
            placeholder={
              selectedType === 'AMOUNT'
                ? 'Наприклад, Поїздка в гори'
                : selectedType === 'COUNTER'
                  ? 'Наприклад, Прочитати 10 книг'
                  : 'Наприклад, Зробити 100 000 кроків'
            }
            register={register('title')}
            error={errors.title}
          />

          {/* Цільове та поточне значення */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="targetValue"
              label="Цільове значення"
              type="number"
              min={1}
              placeholder={selectedType === 'AMOUNT' ? '30000' : '10'}
              register={register('targetValue', { valueAsNumber: true })}
              error={errors.targetValue}
            />

            <Input
              id="currentValue"
              label="Поточний прогрес"
              type="number"
              min={0}
              max={targetValue ? Number(targetValue) : undefined}
              placeholder="0"
              register={register('currentValue', { valueAsNumber: true })}
              error={errors.currentValue}
            />
          </div>

          {/* Динамічні поля залежно від типу */}
          {selectedType === 'AMOUNT' ? (
            <div>
              <label className="block text-sm font-black text-text mb-2">
                Валюта
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CURRENCY_OPTIONS.map(c => {
                  const isSelected = selectedCurrency === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setValue('currency', c.value)}
                      className={`h-11 rounded-xl border text-sm font-bold transition-all ${
                        isSelected
                          ? 'border-primary bg-primarySoft text-primary'
                          : 'border-border bg-panelsColor text-lightText hover:border-borderHover hover:text-text'
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <Input
              id="unit"
              label="Одиниця виміру"
              placeholder={
                selectedType === 'COUNTER'
                  ? 'Наприклад, вечорів, книг, фільмів'
                  : 'Наприклад, км, кроків, тренувань'
              }
              register={register('unit')}
              error={errors.unit}
            />
          )}

          {/* Дедлайн */}
          <Input
            id="dueDate"
            label="Дедлайн"
            type="date"
            register={register('dueDate')}
            error={errors.dueDate}
          />

          {/* Опис */}
          <Input
            id="description"
            label="Опис (необов'язково)"
            placeholder="Короткі деталі або мотивація"
            register={register('description')}
            error={errors.description}
          />

          {/* Інлайн-підтвердження видалення (Опція 1.1) */}
          {isConfirmingDelete ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-danger/40 bg-dangerSoft p-3.5 text-xs animate-in fade-in">
              <span className="font-extrabold text-danger">
                Ви дійсно хочете видалити цю ціль?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="rounded-lg bg-white px-3 py-1.5 font-bold text-lightText hover:text-text shadow-xs"
                >
                  Ні, залишити
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg bg-danger px-3 py-1.5 font-bold text-white hover:opacity-95 shadow-xs"
                >
                  {isDeleting ? 'Видалення...' : 'Так, видалити'}
                </button>
              </div>
            </div>
          ) : (
            /* Звичайний футер кнопок */
            <div className="mt-6 flex items-center justify-between gap-3 pt-2">
              <div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-danger hover:bg-dangerSoft transition-colors"
                  >
                    Видалити ціль
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-lightText hover:bg-panelsColor transition-colors"
                >
                  Скасувати
                </button>
                <PrimaryButton type="submit" disabled={isSaving}>
                  {isSaving
                    ? 'Збереження...'
                    : isEditMode
                      ? 'Зберегти зміни'
                      : 'Створити ціль'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
