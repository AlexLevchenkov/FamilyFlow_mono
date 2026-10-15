import { Icon, PageHero, Panel, PrimaryButton } from '@ui';
import { goals } from '@mocks/data';

export function GoalsView() {
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
            Зберігайте сімейні бажання, розподіляйте кроки й святкуйте кожне
            досягнення разом.
          </p>
        </div>
        <PrimaryButton className="shrink-0">
          <Icon name="plus" size={18} /> Нова ціль
        </PrimaryButton>
      </PageHero>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {goals.map(goal => (
          <Panel
            as="article"
            className="transition-all hover:-translate-y-0.5 hover:border-page-border-hover hover:shadow-[0_14px_34px_var(--color-page-shadow-soft)]"
            key={goal.title}
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
              <button aria-label="Більше дій" className="text-[#aaa8b8]">
                <Icon name="more" size={19} />
              </button>
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
      <Panel
        as="section"
        className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1dc] text-[#db8c26]">
            <Icon name="sun" size={23} />
          </div>
          <div>
            <h3 className="font-extrabold">Досягнення місяця</h3>
            <p className="mt-1 text-sm text-[#9290a4]">
              Ви виконали 7 спільних кроків — це на 3 більше, ніж у лютому.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#f4efff] px-4 py-2 text-xs font-extrabold text-[#7054c5]">
          +43% прогресу
        </span>
      </Panel>
    </div>
  );
}
