import { create } from 'zustand';
import { getApiErrorMessage, listApi, listItemApi } from '@api';
import type { ListItemModel, ListModel } from '@api/contracts';
import type { Task } from '../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: string;
  showComposer: boolean;
  newTask: string;
  loadTasks: () => Promise<void>;
  addTask: () => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  setFilter: (filter: string) => void;
  setShowComposer: (show: boolean) => void;
  setNewTask: (task: string) => void;
}

function toTask(item: ListItemModel, list: ListModel): Task {
  return {
    id: item.id,
    listId: item.listId,
    title: item.title,
    meta: item.description || list.title,
    time: item.dueDate
      ? new Date(item.dueDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Без терміну',
    dueDate: item.dueDate,
    category: list.title,
    color: list.color || '#8b63de',
    done: item.completed,
  };
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: 'Всі',
  showComposer: false,
  newTask: '',

  async loadTasks() {
    set({ loading: true, error: null });
    try {
      const listsResponse = await listApi.getUserLists({ page: 1 });
      const lists = listsResponse.data.data.data.filter(
        list => list.type === 'tasks'
      );
      const itemsByList = await Promise.all(
        lists.map(async list => {
          const response = await listItemApi.getListItems({ listId: list.id });
          return response.data.data.data.map(item => toTask(item, list));
        })
      );
      set({ tasks: itemsByList.flat(), loading: false });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, 'Не вдалося завантажити справи'),
        loading: false,
      });
    }
  },

  async addTask() {
    const title = get().newTask.trim();
    if (!title) return;
    set({ error: null });
    try {
      const listsResponse = await listApi.getUserLists({ page: 1 });
      let list = listsResponse.data.data.data.find(
        item => item.type === 'tasks'
      );
      if (!list) {
        const createdList = await listApi.createList({
          title: 'Справи',
          type: 'tasks',
          color: '#5267ca',
          icon: 'tasks',
        });
        list = createdList.data.data;
      }
      await listItemApi.createListItem({
        listId: list.id,
        title,
        completed: false,
        position: get().tasks.length,
      });
      set({ newTask: '', showComposer: false });
      await get().loadTasks();
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося додати справу') });
    }
  },

  async toggleTask(id) {
    const task = get().tasks.find(item => item.id === id);
    if (!task) return;
    set({ error: null });
    try {
      await listItemApi.updateListItem(id, {
        listId: task.listId,
        completed: !task.done,
      });
      set(state => ({
        tasks: state.tasks.map(item =>
          item.id === id ? { ...item, done: !item.done } : item
        ),
      }));
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося оновити справу') });
    }
  },

  setFilter: filter => set({ filter }),
  setShowComposer: showComposer => set({ showComposer }),
  setNewTask: newTask => set({ newTask }),
}));
