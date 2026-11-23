import type { FamilyRole } from '@types';

export const ROLE_LABELS: Record<FamilyRole, string> = {
  OWNER: 'Власник',
  PARENT: 'Батьки',
  CHILD: 'Дитина',
  MEMBER: 'Учасник',
};

export const ROLE_OPTIONS: Array<{
  value: FamilyRole;
  label: string;
  desc: string;
}> = [
  {
    value: 'PARENT',
    label: 'Батьки',
    desc: 'Може створювати справи та запрошувати учасників',
  },
  {
    value: 'CHILD',
    label: 'Дитина',
    desc: 'Може переглядати та виконувати призначені справи',
  },
  {
    value: 'MEMBER',
    label: 'Учасник',
    desc: 'Звичайний член родини з доступом до спільного простору',
  },
];

export const MEMBER_PALETTE = [
  '#7955d6',
  '#ff708f',
  '#38bdf8',
  '#10b981',
  '#f2a13b',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
];
