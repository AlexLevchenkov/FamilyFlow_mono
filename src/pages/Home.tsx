import { Icon } from "../ui/atoms/Icon"
import { FamilyAvatar } from "../ui/atoms/FamilyAvatar"
import familyIllustration from "../imports/______________.png"
import { events, family } from "../mocks/data"
import type { Task } from "../types/index"
import { Panel } from "../ui/atoms/Panel"
import { PrimaryButton } from "../ui/atoms/PrimaryButton"
import { EventCard } from "../ui/molecules/EventCard"
import { TaskListPanel } from "../ui/organisms/TaskListPanel"

interface HomeProps {
  tasks: Task[];
  visibleTasks: Task[];
  completed: number;
  progress: number;
  filter: string;
  setFilter: (filter: string) => void;
  showComposer: boolean;
  setShowComposer: (show: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  addTask: () => void;
  toggleTask: (id: number) => void;
  setActiveNav: (nav: string) => void;
}

export function Home({
  tasks,
  visibleTasks,
  completed,
  progress,
  filter,
  setFilter,
  showComposer,
  setShowComposer,
  newTask,
  setNewTask,
  addTask,
  toggleTask,
  setActiveNav,
}: HomeProps) {
  return (
    <>
      <section className="relative min-h-[290px] overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.8),transparent_34%),linear-gradient(120deg,#eee8ff_0%,#e9edff_54%,#e5f4ef_100%)] p-[34px_36px] shadow-[0_14px_40px_rgba(64,54,112,0.08)] sm:min-h-auto sm:rounded-[22px] sm:p-[27px_23px] before:absolute before:-bottom-[80px] before:right-[21%] before:h-[240px] before:w-[240px] before:rounded-full before:border-[45px] before:border-white/25">
        <div className="relative z-10 max-w-[530px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 text-xs font-extrabold text-[#6951bc] backdrop-blur">
            <Icon name="sun" size={15} /> Гарного сімейного дня
          </div>
          <h2 className="max-w-[480px] text-[30px] font-extrabold leading-[1.12] tracking-[-1px] sm:text-[38px]">
            Усе важливе для родини — в одному місці
          </h2>
          <p className="mt-3 max-w-[460px] text-sm leading-6 text-[#656580] sm:text-base">
            Сьогодні у вас 3 активні справи. Розподіляйте задачі та
            знаходьте більше часу одне для одного.
          </p>
          <PrimaryButton
            className="mt-6"
            onClick={() => setShowComposer(true)}
          >
            <Icon name="plus" size={18} /> Додати справу
          </PrimaryButton>
        </div>
        <img
          alt="Щаслива родина біля дому"
          className="absolute bottom-0 right-[-50px] hidden h-[97%] w-[48%] object-contain object-bottom lg:block xl:right-3"
          src={familyIllustration}
        />
      </section>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(310px,.75fr)]">
        <TaskListPanel
          title="Справи на сьогодні"
          description={`${completed} з ${tasks.length} вже виконано`}
          visibleTasks={visibleTasks}
          filter={filter}
          setFilter={setFilter}
          showComposer={showComposer}
          setShowComposer={setShowComposer}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          toggleTask={toggleTask}
          showFooterAdd
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <Panel>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[19px] font-black tracking-[-0.25px]">Наша родина</h3>
              <button
                className="text-xs font-extrabold text-[#7656d0]"
                onClick={() => setActiveNav("Родина")}
              >
                Керувати
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {family.map((person) => (
                <button
                  className="flex min-w-0 flex-col items-center rounded-[15px] p-[7px_2px] transition-all hover:-translate-y-[2px] hover:bg-[#faf9fd]"
                  key={person.name}
                  onClick={() => setActiveNav("Родина")}
                >
                  <FamilyAvatar
                    initials={person.initials}
                    color={person.color}
                  />
                  <strong className="mt-[8px] w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px]">{person.name}</strong>
                  <small className="mt-[2px] text-[9px] font-bold text-[#aaa8b7]">{person.tasks} справи</small>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#9896a8]">
                  Тижневий прогрес
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">
                  {progress}%
                </p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f8f3] text-[#35aa90]">
                <Icon name="target" size={22} />
              </div>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#efedf5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8860df] to-[#aa7de8] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-bold text-[#8f8da0]">
                {completed} виконано
              </span>
              <span className="font-extrabold text-[#6450a8]">
                Чудовий початок!
              </span>
            </div>
          </Panel>
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[19px] font-black tracking-[-0.25px]">Найближчі події</h3>
              <p className="mt-1 text-sm text-[#9290a4]">
                Не пропустіть важливе
              </p>
            </div>
            <button
              className="text-xs font-extrabold text-[#7656d0]"
              onClick={() => setActiveNav("Календар")}
            >
              Весь календар
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.title}
                day={String(event.day).padStart(2, "0")}
                month={event.month}
                title={event.title}
                time={event.time}
                color={event.color}
              />
            ))}
          </div>
        </Panel>

        <Panel className="flex items-center gap-5 bg-gradient-to-br from-[#302b66] to-[#6051a6] text-white">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] bg-white/12 text-[#d9ccff]">
            <Icon name="users" size={27} />
          </div>
          <div>
            <p className="text-lg font-extrabold">
              Спільний час має значення
            </p>
            <p className="mt-1 text-sm leading-5 text-white/65">
              Ви запланували 2 сімейні події цього тижня.
            </p>
          </div>
          <Icon name="chevron" size={20} />
        </Panel>
      </section>
    </>
  )
}
