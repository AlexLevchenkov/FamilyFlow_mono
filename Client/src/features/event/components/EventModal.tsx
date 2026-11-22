import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Input, PrimaryButton, Icon } from '@ui';
import type { CreateEventBody, EventModel, UpdateEventBody } from '@types';
import {
  createEventFormSchema,
  EVENT_COLORS,
  REPEATABILITY_OPTIONS,
  type CreateEventFormData,
} from '../schemas';
import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from '../hooks';
import { formatDateKey } from '../utils/calendarUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventModel | null;
  defaultDate?: Date;
}

function extractTime(date?: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (hours === '00' && minutes === '00') return '';
  return `${hours}:${minutes}`;
}

export function EventModal({
  isOpen,
  onClose,
  event,
  defaultDate,
}: EventModalProps) {
  const isEditMode = Boolean(event);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { mutate: createEvent, isPending: isCreating } =
    useCreateEventMutation();
  const { mutate: updateEvent, isPending: isUpdating } =
    useUpdateEventMutation();
  const { mutate: deleteEvent, isPending: isDeleting } =
    useDeleteEventMutation();

  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      color: EVENT_COLORS[0].value,
      repeatability: 'none',
      isPersonal: false,
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    setIsConfirmingDelete(false);

    if (event) {
      // Показуємо оригінальну (базову) дату події, щоб при збереженні не скидати історію
      const baseDate = event.originalDate
        ? new Date(event.originalDate)
        : new Date(event.date);

      reset({
        title: event.title,
        date: formatDateKey(baseDate),
        time: extractTime(event.originalDate || event.date),
        color: event.color || EVENT_COLORS[0].value,
        repeatability: event.repeatability || 'none',
        isPersonal: event.visibility === 'personal',
      });
    } else {
      const initialDate = defaultDate ? new Date(defaultDate) : new Date();
      reset({
        title: '',
        date: formatDateKey(initialDate),
        time: '',
        color: EVENT_COLORS[0].value,
        repeatability: 'none',
        isPersonal: false,
      });
    }
  }, [event, defaultDate, isOpen, reset]);

  const handleClose = () => {
    setIsConfirmingDelete(false);
    reset();
    onClose();
  };

  const onSubmit = (data: CreateEventFormData) => {
    // Формуємо дату з урахуванням часу (Опція 4.1)
    const [year, month, day] = data.date.split('-').map(Number);
    let hours = 0;
    let minutes = 0;

    if (data.time) {
      const [h, m] = data.time.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        hours = h;
        minutes = m;
      }
    }

    const eventDateTime = new Date(year, month - 1, day, hours, minutes);
    const visibility = data.isPersonal ? 'personal' : 'shared';

    if (isEditMode && event) {
      const payload: UpdateEventBody = {
        title: data.title.trim(),
        color: data.color,
        date: eventDateTime,
        repeatability: data.repeatability,
        visibility,
      };

      updateEvent(
        { id: event.id, dto: payload },
        {
          onSuccess: handleClose,
        }
      );
    } else {
      const payload: CreateEventBody = {
        title: data.title.trim(),
        color: data.color,
        date: eventDateTime,
        repeatability: data.repeatability,
        visibility,
      };

      createEvent(payload, {
        onSuccess: handleClose,
      });
    }
  };

  const handleDelete = () => {
    if (!event) return;
    deleteEvent(event.id, {
      onSuccess: handleClose,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {isEditMode ? 'Редагування події' : 'Нова подія'}
          </h2>
          <p className="mt-1 text-sm text-lightText">
            {isEditMode
              ? 'Оновіть час, назву, видимість чи повторюваність події.'
              : 'Додайте спільну сімейну або особисту подію чи свято.'}
          </p>
        </div>

        {/* Інформаційний банер про повторювану подію */}
        {isEditMode &&
          event &&
          event.repeatability &&
          event.repeatability !== 'none' && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primarySoft/30 p-3 text-xs text-primary font-bold">
              <Icon name="clock" size={16} />
              <span>
                Повторювана серія подій (початок дії:{' '}
                {event.originalDate
                  ? new Date(event.originalDate).toLocaleDateString('uk-UA')
                  : new Date(event.date).toLocaleDateString('uk-UA')}
                )
              </span>
            </div>
          )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Назва події */}
          <Input
            id="title"
            label="Назва події"
            placeholder="Наприклад, День народження, Візит до лікаря"
            register={register('title')}
            error={errors.title}
          />

          {/* Дата та час (Опція 4.1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="date"
              label="Дата"
              type="date"
              register={register('date')}
              error={errors.date}
            />

            <Input
              id="time"
              label="Час (необов'язково)"
              type="time"
              placeholder="14:00"
              register={register('time')}
              error={errors.time}
            />
          </div>

          {/* Палітра кольорів */}
          <div>
            <label className="block text-sm font-black text-text mb-2">
              Колір мітки
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {EVENT_COLORS.map(c => {
                const isSelected = selectedColor === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setValue('color', c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`h-8 w-8 rounded-full transition-transform ${isSelected
                        ? 'ring-3 ring-primary/40 ring-offset-2 scale-110 shadow-sm'
                        : 'hover:scale-105'
                      }`}
                    title={c.label}
                  />
                );
              })}
            </div>
            {errors.color && (
              <p className="mt-1 text-xs text-red-500">{errors.color.message}</p>
            )}
          </div>

          {/* Повторюваність */}
          <div>
            <label
              htmlFor="repeatability"
              className="block text-sm font-black text-text mb-2"
            >
              Повторюваність
            </label>
            <div className="relative flex h-13 items-center rounded-[14px] border border-border bg-panelsColor px-3 text-text transition focus-within:border-focus focus-within:bg-white focus-within:shadow-[0_0_0_4px_var(--color-focusSoft)]">
              <select
                id="repeatability"
                {...register('repeatability')}
                className="w-full bg-transparent text-sm font-bold text-text outline-none cursor-pointer"
              >
                {REPEATABILITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.repeatability && (
              <p className="mt-1 text-xs text-red-500">
                {errors.repeatability.message}
              </p>
            )}
          </div>

          {/* Лише для мене (Особиста подія) */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-panelsColor p-3.5">
            <div>
              <p className="text-sm font-extrabold text-text">Лише для мене</p>
              <p className="text-xs text-lightText">
                Цю подію бачитимете лише ви, інші члени сім'ї її не побачать
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                {...register('isPersonal')}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-border peer-checked:bg-primary peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          {/* Інлайн-підтвердження видалення */}
          {isConfirmingDelete ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-danger/40 bg-dangerSoft p-3.5 text-xs animate-in fade-in">
              <span className="font-extrabold text-danger">
                Ви дійсно хочете видалити цю подію?
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
                    Видалити подію
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
                      : 'Створити подію'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
