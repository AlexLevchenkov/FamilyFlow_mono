export * from '@api/contracts';

export type IconName =
  | 'home'
  | 'tasks'
  | 'calendar'
  | 'target'
  | 'users'
  | 'settings'
  | 'bell'
  | 'search'
  | 'plus'
  | 'clock'
  | 'more'
  | 'check'
  | 'sun'
  | 'chevron'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'arrow';

export type Task = {
  id: number;
  title: string;
  meta: string;
  time: string;
  category: string;
  color: string;
  done: boolean;
};

export type AuthView = 'login' | 'register' | 'reset' | 'reset-password';
