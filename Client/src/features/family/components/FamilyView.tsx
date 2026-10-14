import { Icon, Panel, PrimaryButton } from "@ui/atoms"
import { FamilyAvatar } from "./FamilyAvatar"
import { PageHero } from "@ui/molecules"
import { family } from "@mocks/data"

export function FamilyView() {
  return (
    <div className="space-y-6">
      <PageHero variant="family">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7054c5]">
            Простір родини Ковалів
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            Разом усе простіше
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#737188]">
            Розподіляйте справи справедливо, залишайтесь на зв’язку та
            знаходьте більше часу одне для одного.
          </p>
        </div>
        <PrimaryButton className="shrink-0">
          <Icon name="plus" size={18} /> Запросити
        </PrimaryButton>
      </PageHero>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {family.map((person, index) => (
          <Panel as="article" className="text-center" key={person.name}>
            <FamilyAvatar
              initials={person.initials}
              color={person.color}
              size="profile"
            />
            <h3 className="mt-4 text-lg font-extrabold">
              {person.name}
            </h3>
            <p className="mt-1 text-xs font-bold text-[#aaa8b8]">
              {index === 0
                ? "Адміністратор"
                : index === 1
                  ? "Дорослий"
                  : "Дитячий профіль"}
            </p>
            <div className="mt-5 grid grid-cols-2 divide-x divide-[#efedf4] border-t border-[#efedf4] pt-4">
              <div>
                <strong className="block text-lg">
                  {person.tasks}
                </strong>
                <small className="text-[10px] font-bold text-[#aaa8b8]">
                  справи
                </small>
              </div>
              <div>
                <strong className="block text-lg">{index + 2}</strong>
                <small className="text-[10px] font-bold text-[#aaa8b8]">
                  виконано
                </small>
              </div>
            </div>
          </Panel>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight">Активність родини</h2>
            <button className="text-xs font-extrabold text-[#7656d0]">
              Переглянути все
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {[
              [
                "А",
                "Анна виконала справу",
                "Замовити продукти на тиждень",
                "#e76f91",
              ],
              [
                "М",
                "Марк додав подію",
                "Футбольне тренування",
                "#f2a13b",
              ],
              [
                "О",
                "Олексій оновив ціль",
                "Сімейна подорож у Карпати",
                "#5267ca",
              ],
            ].map(([initial, title, detail, color]) => (
              <div
                className="flex items-center gap-3 border-b border-[#f0eef5] pb-4 last:border-0 last:pb-0"
                key={title}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold">{title}</p>
                  <p className="mt-1 truncate text-xs text-[#9997a9]">
                    {detail}
                  </p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-[#aaa8b8]">
                  сьогодні
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-lg font-black tracking-tight">Баланс справ</h2>
          <p className="mt-1 text-sm text-[#9290a4]">
            Активні задачі цього тижня
          </p>
          <div className="mt-6 space-y-4">
            {family.map((person) => (
              <div key={person.name}>
                <div className="mb-2 flex justify-between text-xs font-extrabold">
                  <span>{person.name}</span>
                  <span className="text-[#9997a9]">{person.tasks}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#efedf5]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: person.color,
                      width: `${person.tasks * 22}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}
