import { useNavigate } from 'react-router-dom';
import { Panel } from '@ui';
import { FamilyAvatar } from '@features/family';
import { useFamilyQuery } from '@hooks';

const PALETTE = ['#7955d6', '#ff708f', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'];

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Власник',
  PARENT: 'Батьки',
  CHILD: 'Дитина',
  MEMBER: 'Учасник',
};

export function HomeFamilyWidget() {
  const navigate = useNavigate();
  const { family, isLoading } = useFamilyQuery();

  const members = family?.members || [];

  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[19px] font-black tracking-[-0.25px]">
          Наша родина
        </h3>
        <button
          className="cursor-pointer text-xs font-extrabold text-primary hover:underline"
          onClick={() => navigate('/family')}
        >
          {members.length > 0 ? 'Керувати' : 'Створити'}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-2 animate-pulse"
            >
              <div className="size-[47px] rounded-[17px] bg-background" />
              <div className="h-2.5 w-10 rounded bg-background" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <p className="text-sm font-semibold text-textMuted">
            Ви ще не створили родину
          </p>
          <button
            className="mt-3 cursor-pointer rounded-xl bg-primarySoft px-4 py-2 text-xs font-extrabold text-primary transition-all hover:bg-primary/20"
            onClick={() => navigate('/family')}
          >
            Створити або долучитись
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {members.slice(0, 4).map((member, index) => {
            const name = member.user?.name || member.user?.email || 'Член родини';
            const initials =
              name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(p => p[0])
                .join('')
                .toLocaleUpperCase('uk-UA') || '?';
            const color = PALETTE[index % PALETTE.length];
            const roleText = ROLE_LABELS[member.role] || 'Учасник';

            return (
              <button
                key={member.id}
                className="flex min-w-0 cursor-pointer flex-col items-center rounded-[15px] p-[7px_2px] transition-all hover:-translate-y-0.5 hover:bg-panelsColor"
                onClick={() => navigate('/family')}
                title={`${name} (${roleText})`}
              >
                <FamilyAvatar initials={initials} color={color} />
                <strong className="mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[11px]">
                  {name}
                </strong>
                <small className="mt-0.5 text-[9px] font-bold text-textPlaceholder">
                  {roleText}
                </small>
              </button>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
