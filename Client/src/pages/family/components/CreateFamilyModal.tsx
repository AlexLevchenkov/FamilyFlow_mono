import { useState } from 'react';
import { Modal, PrimaryButton } from '@ui';
import { useCreateFamilyMutation } from '@features/family';

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFamilyModal({ isOpen, onClose }: CreateFamilyModalProps) {
  const [name, setName] = useState('');
  const { mutate: createFamily, isPending } = useCreateFamilyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createFamily(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName('');
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-black tracking-tight">Створити родину</h3>
      <p className="mt-1 text-sm text-lightText">
        Введіть назву вашого сімейного простору
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-text">
            Назва родини
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="Наприклад: Родина Ковалів"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-text outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-extrabold text-lightText hover:text-text"
          >
            Скасувати
          </button>
          <PrimaryButton type="submit" disabled={isPending || !name.trim()}>
            {isPending ? 'Створення...' : 'Створити родину'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
