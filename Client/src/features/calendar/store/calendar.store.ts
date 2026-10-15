import { create } from 'zustand';
import { getApiErrorMessage, listApi, listItemApi } from '@api';
import type { ListItemModel, ListModel } from '@api/contracts';

export interface CalendarEvent {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  dueDate: string;
  day: number;
  month: string;
  time: string;
  color: string;
}

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  createEvent: (title: string, dueDate: string) => Promise<void>;
}

function toEvent(item: ListItemModel, list: ListModel): CalendarEvent | null {
  if (!item.dueDate) return null;
  const date = new Date(item.dueDate);
  return {
    id: item.id,
    listId: item.listId,
    title: item.title,
    description: item.description,
    dueDate: item.dueDate,
    day: date.getDate(),
    month: new Intl.DateTimeFormat('uk-UA', { month: 'short' })
      .format(date)
      .replace('.', '')
      .toUpperCase(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    color: list.color || '#7656d0',
  };
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  async loadEvents() {
    set({ loading: true, error: null });
    try {
      const response = await listApi.getUserLists({ page: 1 });
      const lists = response.data.data.data.filter(
        list => list.type === 'events'
      );
      const eventsByList = await Promise.all(
        lists.map(async list => {
          const itemsResponse = await listItemApi.getListItems({
            listId: list.id,
          });
          return itemsResponse.data.data.data
            .map(item => toEvent(item, list))
            .filter((event): event is CalendarEvent => event !== null);
        })
      );
      set({
        events: eventsByList
          .flat()
          .sort(
            (left, right) =>
              Date.parse(left.dueDate) - Date.parse(right.dueDate)
          ),
        loading: false,
      });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, 'Не вдалося завантажити події'),
        loading: false,
      });
    }
  },

  async createEvent(title, dueDate) {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    set({ error: null });
    try {
      const listsResponse = await listApi.getUserLists({ page: 1 });
      let list = listsResponse.data.data.data.find(
        item => item.type === 'events'
      );
      if (!list) {
        const created = await listApi.createList({
          title: 'Сімейні події та плани',
          type: 'events',
          color: '#e76f91',
          icon: 'calendar',
        });
        list = created.data.data;
      }
      await listItemApi.createListItem({
        listId: list.id,
        title: cleanTitle,
        completed: false,
        dueDate,
        position: get().events.length,
      });
      await get().loadEvents();
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося створити подію') });
    }
  },
}));
