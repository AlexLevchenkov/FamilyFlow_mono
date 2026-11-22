import { Icon, Panel } from '@ui';

interface HomeProgressWidgetProps {
  completed: number;
  total: number;
  progress: number;
}

export function HomeProgressWidget({
  completed,
  total,
  progress,
}: HomeProgressWidgetProps) {
  const motivationText =
    progress === 100
      ? 'Чудова робота! Все виконано!'
      : progress >= 50
        ? 'Більше половини позаду!'
        : completed > 0
          ? 'Чудовий початок!'
          : 'Час до нових звершень!';

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-textPlaceholder">
            Тижневий прогрес
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight">
            {progress}%
          </p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-successSoft text-success">
          <Icon name="target" size={22} />
        </div>
      </div>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-primaryLight transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-bold text-textPlaceholder">
          {completed} з {total} виконано
        </span>
        <span className="font-extrabold text-textMuted">{motivationText}</span>
      </div>
    </Panel>
  );
}
