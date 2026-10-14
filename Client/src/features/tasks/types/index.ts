export type Task = {
  id: number;
  listId: number;
  title: string;
  meta: string;
  time: string;
  dueDate: string | null;
  category: string;
  color: string;
  done: boolean;
};
