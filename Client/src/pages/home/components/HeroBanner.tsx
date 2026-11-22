import { Icon, PrimaryButton } from '@ui';
import familyIllustration from "@assets/Images/Сім'я без фону.png";

interface HeroBannerProps {
  activeTasksCount: number;
  onAddTask: () => void;
}

function pluralizeTasks(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${count} активних справ`;
  if (mod10 === 1) return `${count} активна справа`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} активні справи`;
  return `${count} активних справ`;
}

export function HeroBanner({ activeTasksCount, onAddTask }: HeroBannerProps) {
  const description =
    activeTasksCount > 0
      ? `Сьогодні у вас ${pluralizeTasks(activeTasksCount)}. Розподіляйте задачі та знаходьте більше часу одне для одного.`
      : 'На сьогодні немає активних справ. Чудовий час для відпочинку або нових планів!';

  return (
    <section
      className="relative min-h-72 overflow-hidden rounded-[28px] border border-white/70
      bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.8),transparent_34%),linear-gradient(120deg,#eee8ff_0%,#e9edff_54%,#e5f4ef_100%)]
      p-[34px_36px]
      shadow-[0_14px_40px_rgba(64,54,112,0.08)]
      sm:min-h-auto sm:rounded-[22px] sm:p-[27px_23px]
      before:absolute before:-bottom-20 before:right-[21%] before:h-60 before:w-60 before:rounded-full before:border-45 before:border-white/25"
    >
      <div className="relative z-10 max-w-130">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 text-xs font-extrabold text-primary backdrop-blur">
          <Icon name="sun" size={15} /> Гарного сімейного дня
        </div>
        <h2 className="max-w-120 text-[30px] font-extrabold leading-[1.12] tracking-[-1px] sm:text-[38px]">
          Усе важливе для родини — в одному місці
        </h2>
        <p className="mt-3 max-w-115 text-sm leading-6 text-text sm:text-base">
          {description}
        </p>
        <PrimaryButton className="mt-6" onClick={onAddTask}>
          <Icon name="plus" size={18} /> Додати справу
        </PrimaryButton>
      </div>
      <img
        alt="Щаслива родина біля дому"
        className="absolute bottom-0 -right-12 hidden h-[97%] w-[48%] object-contain object-bottom lg:block xl:right-3"
        src={familyIllustration}
      />
    </section>
  );
}
