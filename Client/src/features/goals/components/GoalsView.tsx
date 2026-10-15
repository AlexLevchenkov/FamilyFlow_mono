import { useEffect, useState } from 'react';
import { Icon, PageHero, Panel, PrimaryButton } from '@ui';
import { useGoalsStore } from '../store/goals.store';

export function GoalsView() {
  const goals = useGoalsStore(state => state.goals);
  const loading = useGoalsStore(state => state.loading);
  const error = useGoalsStore(state => state.error);
  const loadGoals = useGoalsStore(state => state.loadGoals);
  const createGoal = useGoalsStore(state => state.createGoal);
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  async function submitGoal() {
    if (!title.trim() || !category.trim()) return;
    await createGoal({ title: title.trim(), category: category.trim() });
    if (!useGoalsStore.getState().error) {
      setTitle('');
      setCategory('');
      setShowComposer(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero variant="goals">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7054c5]">
            Спільний прогрес
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            Великі мрії починаються з маленьких кроків
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#737188]">
            Зберігайте сімейні бажання та відстежуйте прогрес разом.
          </p>
        </div>
        <PrimaryButton
          className="shrink-0"
          onClick={() => setShowComposer(value => !value)}
        >
          <Icon name="plus" size={18} /> Нова ціль
        </PrimaryButton>
      </PageHero>

      {showComposer && (
        <Panel as="section">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              aria-label="Назва цілі"
              className="rounded-xl border border-[#e5e1f2] px-4 py-2.5 text-sm outline-none focus:border-[#8b63de]"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Назва цілі"
            />
            <input
              aria-label="Категорія цілі"
              className="rounded-xl border border-[#e5e1f2] px-4 py-2.5 text-sm outline-none focus:border-[#8b63de]"
              value={category}
              onChange={event => setCategory(event.target.value)}
              placeholder="Категорія"
            />
          </div>
          <PrimaryButton className="mt-3" onClick={() => void submitGoal()}>
            Створити ціль
          </PrimaryButton>
        </Panel>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-[#9290a4]">Завантаження цілей…</p>}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goals.map(goal => (
          <Panel
            as="article"
            className="transition-all hover:-translate-y-0.5 hover:border-page-border-hover hover:shadow-[0_14px_34px_var(--color-page-shadow-soft)]"
            key={goal.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{
                  backgroundColor: `${goal.color}18`,
                  color: goal.color,
                }}
              >
                <Icon name="target" size={23} />
              </div>
            </div>
            <p
              className="mt-5 text-xs font-extrabold uppercase tracking-wider"
              style={{ color: goal.color }}
            >
              {goal.category}
            </p>
            <h3 className="mt-2 text-lg font-extrabold">{goal.title}</h3>
            <p className="mt-2 text-sm text-[#9290a4]">{goal.detail}</p>
            <div className="mt-6 flex items-center justify-between text-xs font-extrabold">
              <span className="text-[#8f8da0]">Прогрес</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#efedf5]">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: goal.color,
                  width: `${goal.progress}%`,
                }}
              />
            </div>
          </Panel>
        ))}
      </section>
    </div>
  );
}
