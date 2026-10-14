import { useEffect, useState } from 'react';
import { Icon, PageHero, Panel, PrimaryButton } from '@ui';
import { FamilyAvatar } from './FamilyAvatar';
import { useFamilyStore } from '../store/family.store';

const memberColors = ['#5267ca', '#e76f91', '#f2a13b', '#4cb89e'];

export function FamilyView() {
  const family = useFamilyStore(state => state.family);
  const loading = useFamilyStore(state => state.loading);
  const error = useFamilyStore(state => state.error);
  const loadFamily = useFamilyStore(state => state.loadFamily);
  const addMember = useFamilyStore(state => state.addMember);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    void loadFamily();
  }, [loadFamily]);

  async function inviteMember() {
    if (!email.trim()) return;
    const added = await addMember(email.trim());
    if (added) {
      setEmail('');
      setShowInvite(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero variant="family">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7054c5]">
            Спільний простір
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            {family?.name ?? 'Наша родина'}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#737188]">
            Додавайте до родини людей із зареєстрованими акаунтами FamilyFlow.
          </p>
        </div>
        <PrimaryButton className="shrink-0" onClick={() => setShowInvite(value => !value)}>
          <Icon name="plus" size={18} /> Запросити
        </PrimaryButton>
      </PageHero>

      {showInvite && (
        <Panel as="section">
          <label className="block text-sm font-extrabold" htmlFor="family-member-email">
            Email зареєстрованого користувача
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id="family-member-email"
              className="min-w-0 flex-1 rounded-xl border border-[#e5e1f2] px-4 py-2.5 text-sm outline-none focus:border-[#8b63de]"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && void inviteMember()}
              placeholder="name@example.com"
            />
            <PrimaryButton onClick={() => void inviteMember()}>Додати</PrimaryButton>
          </div>
        </Panel>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-[#9290a4]">Завантаження родини…</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(family?.members ?? []).map((person, index) => {
          const name = person.name ?? person.email;
          return (
            <Panel as="article" className="text-center" key={person.userId}>
              <FamilyAvatar
                initials={name.slice(0, 1).toUpperCase()}
                color={memberColors[index % memberColors.length]}
                size="profile"
              />
              <h3 className="mt-4 text-lg font-extrabold">{name}</h3>
              <p className="mt-1 text-xs font-bold text-[#aaa8b8]">
                {person.isOwner ? 'Адміністратор' : 'Учасник'}
              </p>
              <p className="mt-4 truncate text-xs text-[#9290a4]">{person.email}</p>
            </Panel>
          );
        })}
      </section>
    </div>
  );
}
