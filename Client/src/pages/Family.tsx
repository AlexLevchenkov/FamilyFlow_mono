import { useState } from 'react';
import { Icon, PageHero, Panel, PrimaryButton } from '@ui';
import { useFamilyQuery } from '@hooks';
import {
  FamilyAvatar,
  MEMBER_PALETTE,
  ROLE_LABELS,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from '@features/family';
import type { FamilyRole } from '@types';
import { CreateFamilyModal, InviteMemberModal } from './family/components';

const ROLE_STYLES: Record<FamilyRole, string> = {
  OWNER: 'bg-primarySoft text-primary',
  PARENT: 'bg-[#eef1ff] text-[#5267ca]',
  CHILD: 'bg-[#fff3df] text-[#b77a21]',
  MEMBER: 'bg-[#edf8f5] text-[#278b78]',
};

export function Family() {
  const { family, isLoading, isError, refetch } = useFamilyQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { mutate: updateRole } = useUpdateMemberRoleMutation();
  const { mutate: removeMember } = useRemoveMemberMutation();

  const members = family?.members || [];

  const handleRoleChange = (
    memberId: number,
    role: FamilyRole
  ) => {
    if (!family) return;
    updateRole({ familyId: family.id, memberId, dto: { role } });
  };

  const handleRemoveMember = (memberId: number, name: string) => {
    if (!family) return;
    if (!window.confirm(`Вилучити ${name} з родини?`)) return;
    removeMember({ familyId: family.id, memberId });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-panelsColor" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(item => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl bg-panelsColor"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Panel className="py-14 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff0f2] text-[#d95f78]">
          <Icon name="users" size={24} />
        </div>
        <h2 className="mt-4 text-xl font-black">Не вдалося завантажити родину</h2>
        <p className="mt-2 text-sm text-lightText">
          Перевірте з'єднання та спробуйте ще раз.
        </p>
        <button
          type="button"
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-white"
          onClick={() => refetch()}
        >
          Спробувати знову
        </button>
      </Panel>
    );
  }

  if (!family) {
    return (
      <>
        <PageHero variant="family">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
              Сімейний простір
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Створіть простір для вашої родини
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-lightText">
              Додайте близьких, розподіляйте справи та плануйте важливі події разом.
            </p>
          </div>
          <PrimaryButton className="shrink-0" onClick={() => setIsCreateOpen(true)}>
            <Icon name="plus" size={18} /> Створити родину
          </PrimaryButton>
        </PageHero>

        <Panel className="mt-6 py-14 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-[22px] bg-primarySoft text-primary">
            <Icon name="users" size={28} />
          </div>
          <h3 className="mt-5 text-xl font-black">Родини ще немає</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-lightText">
            Створіть сімейний простір і запросіть інших учасників за електронною поштою.
          </p>
          <PrimaryButton className="mt-6" onClick={() => setIsCreateOpen(true)}>
            Почати
          </PrimaryButton>
        </Panel>

        <CreateFamilyModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <PageHero variant="family">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary">
              Простір родини
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              {family.name}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-lightText">
              Разом плануємо справи, події та цілі у спільному сімейному просторі.
            </p>
          </div>
          <PrimaryButton
            className="shrink-0"
            onClick={() => setIsInviteOpen(true)}
          >
            <Icon name="plus" size={18} /> Запросити
          </PrimaryButton>
        </PageHero>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight">Учасники родини</h2>
              <p className="mt-1 text-sm text-lightText">
                {members.length} {members.length === 1 ? 'учасник' : 'учасників'}
              </p>
            </div>
          </div>

          {members.length === 0 ? (
            <Panel className="py-10 text-center">
              <p className="text-sm font-bold text-lightText">
                Додайте першого учасника до родини
              </p>
              <PrimaryButton className="mt-4" onClick={() => setIsInviteOpen(true)}>
                Запросити учасника
              </PrimaryButton>
            </Panel>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {members.map((member, index) => {
                const name =
                  member.user?.name ||
                  member.user?.email ||
                  member.email ||
                  'Член родини';
                const initials =
                  name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map(part => part[0])
                    .join('')
                    .toLocaleUpperCase('uk-UA') || '?';
                const color = MEMBER_PALETTE[index % MEMBER_PALETTE.length];

                return (
                  <Panel as="article" className="text-center" key={member.id}>
                    <FamilyAvatar
                      initials={initials}
                      color={color}
                      size="profile"
                    />
                    <h3 className="mt-4 truncate text-lg font-extrabold" title={name}>
                      {name}
                    </h3>
                    {member.user?.email && member.user.name && (
                      <p className="mt-1 truncate text-xs text-textMuted" title={member.user.email}>
                        {member.user.email}
                      </p>
                    )}
                    {member.activated === false && (
                      <span className="mt-3 inline-flex rounded-full bg-[#fff3df] px-3 py-1 text-xs font-extrabold text-[#b77a21]">
                        Очікує реєстрації
                      </span>
                    )}

                    {member.role === 'OWNER' ? (
                      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${ROLE_STYLES.OWNER}`}>
                        Власник
                      </span>
                    ) : (
                      <select
                        aria-label={`Роль користувача ${name}`}
                        className={`mt-3 cursor-pointer rounded-full px-3 py-1 text-xs font-extrabold outline-none ${ROLE_STYLES[member.role]}`}
                        value={member.role}
                        onChange={event =>
                          handleRoleChange(
                            member.id,
                            event.target.value as FamilyRole
                          )
                        }
                      >
                        <option value="PARENT">Батьки</option>
                        <option value="CHILD">Дитина</option>
                        <option value="MEMBER">Учасник</option>
                      </select>
                    )}

                    {member.role !== 'OWNER' && (
                      <button
                        type="button"
                        className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-extrabold text-[#d95f78] hover:underline"
                        onClick={() => handleRemoveMember(member.id, name)}
                      >
                        <Icon name="trash" size={14} /> Вилучити
                      </button>
                    )}
                  </Panel>
                );
              })}
            </section>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Panel>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Склад родини
                </h2>
                <p className="mt-1 text-sm text-lightText">
                  Ролі та доступ учасників
                </p>
              </div>
              <span className="rounded-full bg-primarySoft px-3 py-1 text-xs font-extrabold text-primary">
                {members.length}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {(['OWNER', 'PARENT', 'CHILD', 'MEMBER'] as FamilyRole[]).map(
                role => {
                  const count = members.filter(member => member.role === role).length;
                  if (count === 0) return null;
                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between rounded-xl border border-background px-4 py-3"
                    >
                      <span className="text-sm font-extrabold">
                        {ROLE_LABELS[role]}
                      </span>
                      <span className="text-sm font-black text-textMuted">
                        {count}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </Panel>

          <Panel>
            <div className="grid size-12 place-items-center rounded-2xl bg-[#edf8f5] text-[#278b78]">
              <Icon name="users" size={22} />
            </div>
            <h2 className="mt-5 text-lg font-black tracking-tight">
              Один простір для всіх
            </h2>
            <p className="mt-2 text-sm leading-6 text-lightText">
              Запрошуйте родину за поштою, призначайте ролі та керуйте спільними справами.
            </p>
            <button
              type="button"
              className="mt-5 text-sm font-extrabold text-primary hover:underline"
              onClick={() => setIsInviteOpen(true)}
            >
              Додати учасника
            </button>
          </Panel>
        </section>
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        familyId={family.id}
      />
    </>
  );
}
