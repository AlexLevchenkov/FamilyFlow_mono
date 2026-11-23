import { useState } from 'react';
import { Modal, PrimaryButton, Icon } from '@ui';
import { useAddMemberMutation, ROLE_OPTIONS } from '@features/family';
import type { FamilyRole } from '@types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: number;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  familyId,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<FamilyRole>('MEMBER');
  const { mutate: addMember, isPending } = useAddMemberMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    addMember(
      {
        familyId,
        dto: {
          email: email.trim(),
          role,
        },
      },
      {
        onSuccess: () => {
          setEmail('');
          setRole('MEMBER');
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-black tracking-tight">Запросити до родини</h3>
      <p className="mt-1 text-sm text-lightText">
        Додайте члена родини за його зареєстрованою електронною поштою
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-text">
            Електронна пошта користувача
          </label>
          <div className="relative">
            <input
              type="email"
              required
              autoFocus
              placeholder="user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-text outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-text">
            Роль у родині
          </label>
          <div className="grid gap-2">
            {ROLE_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                  role === opt.value
                    ? 'border-primary bg-primarySoft/40'
                    : 'border-border bg-white hover:border-borderHover'
                }`}
              >
                <input
                  type="radio"
                  name="familyRole"
                  value={opt.value}
                  checked={role === opt.value}
                  onChange={() => setRole(opt.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-extrabold text-text">
                    {opt.label}
                  </p>
                  <p className="text-xs text-textMuted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-extrabold text-lightText hover:text-text"
          >
            Скасувати
          </button>
          <PrimaryButton type="submit" disabled={isPending || !email.trim()}>
            <Icon name="plus" size={16} />
            {isPending ? 'Запрошення...' : 'Запросити'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
