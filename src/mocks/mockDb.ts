import type {
  UserDetail,
  ListModel,
  SharedListModel,
  ListItemModel,
  ListType,
  AccessType,
} from '@/api/contracts';

const INITIAL_USERS: UserDetail[] = [
  {
    id: 1,
    email: 'alex@familyflow.local',
    name: 'Олексій Коваль',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    emailVerified: true,
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-03-20T12:00:00.000Z',
  },
  {
    id: 2,
    email: 'anna@familyflow.local',
    name: 'Анна Коваль',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    emailVerified: true,
    createdAt: '2026-01-11T11:00:00.000Z',
    updatedAt: '2026-03-18T14:30:00.000Z',
  },
  {
    id: 3,
    email: 'mark@familyflow.local',
    name: 'Марк Коваль',
    avatar: null,
    emailVerified: true,
    createdAt: '2026-02-01T09:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
  },
  {
    id: 4,
    email: 'sofia@familyflow.local',
    name: 'Софія Коваль',
    avatar: null,
    emailVerified: true,
    createdAt: '2026-02-01T09:30:00.000Z',
    updatedAt: '2026-03-10T16:00:00.000Z',
  },
];

const INITIAL_LISTS: ListModel[] = [
  {
    id: 1,
    userId: 1,
    title: 'Справи на сьогодні',
    type: 'tasks' as ListType,
    color: '#5267ca',
    icon: 'tasks',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-26T10:00:00.000Z',
  },
  {
    id: 2,
    userId: 1,
    title: 'Покупки для дому',
    type: 'shopping' as ListType,
    color: '#35b69f',
    icon: 'cart',
    createdAt: '2026-03-05T12:00:00.000Z',
    updatedAt: '2026-03-25T17:30:00.000Z',
  },
  {
    id: 3,
    userId: 1,
    title: 'Сімейні події та плани',
    type: 'events' as ListType,
    color: '#e76f91',
    icon: 'calendar',
    createdAt: '2026-03-10T09:00:00.000Z',
    updatedAt: '2026-03-24T19:00:00.000Z',
  },
];

const INITIAL_ITEMS: ListItemModel[] = [
  {
    id: 1,
    listId: 1,
    title: 'Забрати Марка зі школи',
    description: 'О 14:30 біля центрального входу',
    completed: false,
    priority: 2,
    dueDate: '2026-03-26T14:30:00.000Z',
    position: 0,
    createdAt: '2026-03-26T08:00:00.000Z',
    updatedAt: '2026-03-26T08:00:00.000Z',
  },
  {
    id: 2,
    listId: 1,
    title: 'Запис до сімейного лікаря',
    description: 'Плановий огляд для всієї родини',
    completed: false,
    priority: 1,
    dueDate: '2026-03-27T16:00:00.000Z',
    position: 1,
    createdAt: '2026-03-26T08:15:00.000Z',
    updatedAt: '2026-03-26T08:15:00.000Z',
  },
  {
    id: 3,
    listId: 1,
    title: 'Спланувати вихідні',
    description: 'Обговорити маршрут поїздки в Карпати',
    completed: true,
    priority: 0,
    dueDate: '2026-03-26T19:00:00.000Z',
    position: 2,
    createdAt: '2026-03-25T11:00:00.000Z',
    updatedAt: '2026-03-26T09:30:00.000Z',
  },
  {
    id: 4,
    listId: 2,
    title: 'Органічне молоко 2.5%',
    description: '2 пляшки',
    completed: true,
    priority: 1,
    dueDate: null,
    position: 0,
    createdAt: '2026-03-25T15:00:00.000Z',
    updatedAt: '2026-03-25T18:00:00.000Z',
  },
  {
    id: 5,
    listId: 2,
    title: 'Свіжий хліб та круасани',
    description: 'У пекарні біля дому',
    completed: false,
    priority: 0,
    dueDate: null,
    position: 1,
    createdAt: '2026-03-25T15:10:00.000Z',
    updatedAt: '2026-03-25T15:10:00.000Z',
  },
  {
    id: 6,
    listId: 2,
    title: 'Овочі та зелень для салату',
    description: 'Помідори чері, огірки, шпинат, рукола',
    completed: false,
    priority: 2,
    dueDate: null,
    position: 2,
    createdAt: '2026-03-25T15:15:00.000Z',
    updatedAt: '2026-03-25T15:15:00.000Z',
  },
  {
    id: 7,
    listId: 3,
    title: 'Батьківські збори у школі',
    description: 'Актова зала, 18:30',
    completed: false,
    priority: 2,
    dueDate: '2026-03-28T18:30:00.000Z',
    position: 0,
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 8,
    listId: 3,
    title: 'Сімейний пікнік',
    description: 'Парк культури о 12:00',
    completed: false,
    priority: 1,
    dueDate: '2026-03-30T12:00:00.000Z',
    position: 1,
    createdAt: '2026-03-21T11:00:00.000Z',
    updatedAt: '2026-03-21T11:00:00.000Z',
  },
  {
    id: 9,
    listId: 3,
    title: 'День народження Софії',
    description: 'Замовити торт, кульки та подарунок',
    completed: false,
    priority: 3,
    dueDate: '2026-04-02T17:00:00.000Z',
    position: 2,
    createdAt: '2026-03-22T14:00:00.000Z',
    updatedAt: '2026-03-22T14:00:00.000Z',
  },
];

const INITIAL_SHARED: SharedListModel[] = [
  {
    id: 1,
    listId: 1,
    ownerId: 1,
    recipientId: 2,
    accessTypes: 'fullAccess' as AccessType,
    createdAt: '2026-03-02T12:00:00.000Z',
  },
  {
    id: 2,
    listId: 2,
    ownerId: 1,
    recipientId: 2,
    accessTypes: 'edit' as AccessType,
    createdAt: '2026-03-06T15:00:00.000Z',
  },
];

class MockDatabase {
  private users: UserDetail[] = [];
  private lists: ListModel[] = [];
  private items: ListItemModel[] = [];
  private sharedLists: SharedListModel[] = [];
  private nextUserId = 10;
  private nextListId = 10;
  private nextItemId = 20;
  private nextSharedId = 10;

  constructor() {
    this.reset();
  }

  public reset() {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.lists = JSON.parse(JSON.stringify(INITIAL_LISTS));
    this.items = JSON.parse(JSON.stringify(INITIAL_ITEMS));
    this.sharedLists = JSON.parse(JSON.stringify(INITIAL_SHARED));
  }

  // --- Users ---
  public getUsers(partName?: string, partEmail?: string) {
    let result = [...this.users];
    if (partName) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(partName.toLowerCase())
      );
    }
    if (partEmail) {
      result = result.filter(u =>
        u.email.toLowerCase().includes(partEmail.toLowerCase())
      );
    }
    return result;
  }

  public getUserById(id: number) {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(email: string, name: string) {
    const newUser: UserDetail = {
      id: this.nextUserId++,
      email,
      name,
      avatar: null,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(
    userId: number,
    fields: { name?: string; email?: string; avatar?: string }
  ) {
    const user = this.getUserById(userId);
    if (!user) return null;
    if (fields.name !== undefined) user.name = fields.name;
    if (fields.email !== undefined) user.email = fields.email;
    if (fields.avatar !== undefined) user.avatar = fields.avatar;
    user.updatedAt = new Date().toISOString();
    return user;
  }

  public deleteUser(userId: number) {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      this.users.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- Lists ---
  public getLists(userId = 1) {
    // Return lists owned by user or shared with user
    const sharedListIds = this.sharedLists
      .filter(s => s.recipientId === userId)
      .map(s => s.listId);

    return this.lists.filter(
      l => l.userId === userId || sharedListIds.includes(l.id)
    );
  }

  public getListById(id: number) {
    return this.lists.find(l => l.id === id);
  }

  public createList(
    userId: number,
    title: string,
    type: ListType,
    color?: string,
    icon?: string
  ) {
    const newList: ListModel = {
      id: this.nextListId++,
      userId,
      title,
      type,
      color: color || '#5267ca',
      icon: icon || 'tasks',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.lists.unshift(newList);
    return newList;
  }

  public updateList(
    id: number,
    fields: { title?: string; type?: ListType; color?: string; icon?: string }
  ) {
    const list = this.getListById(id);
    if (!list) return null;
    if (fields.title) list.title = fields.title;
    if (fields.type) list.type = fields.type;
    if (fields.color !== undefined) list.color = fields.color;
    if (fields.icon !== undefined) list.icon = fields.icon;
    list.updatedAt = new Date().toISOString();
    return list;
  }

  public deleteList(id: number) {
    const idx = this.lists.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.lists.splice(idx, 1);
      this.items = this.items.filter(item => item.listId !== id);
      this.sharedLists = this.sharedLists.filter(s => s.listId !== id);
      return true;
    }
    return false;
  }

  public shareList(
    listId: number,
    ownerId: number,
    recipientId: number,
    accessTypes: AccessType
  ) {
    const existing = this.sharedLists.find(
      s =>
        s.listId === listId &&
        s.ownerId === ownerId &&
        s.recipientId === recipientId
    );
    if (existing) {
      existing.accessTypes = accessTypes;
      return existing;
    }
    const newShare: SharedListModel = {
      id: this.nextSharedId++,
      listId,
      ownerId,
      recipientId,
      accessTypes,
      createdAt: new Date().toISOString(),
    };
    this.sharedLists.push(newShare);
    return newShare;
  }

  public removeShare(listId: number, ownerId: number, recipientId: number) {
    const idx = this.sharedLists.findIndex(
      s =>
        s.listId === listId &&
        s.ownerId === ownerId &&
        s.recipientId === recipientId
    );
    if (idx !== -1) {
      this.sharedLists.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- List Items ---
  public getItemsByListId(listId: number) {
    return this.items.filter(item => item.listId === listId);
  }

  public getItemById(id: number) {
    return this.items.find(item => item.id === id);
  }

  public createItem(data: {
    listId: number;
    title: string;
    completed?: boolean;
    description?: string;
    priority?: number;
    dueDate?: string | Date | null;
    position?: number;
  }) {
    const newItem: ListItemModel = {
      id: this.nextItemId++,
      listId: data.listId,
      title: data.title,
      description: data.description || null,
      completed: data.completed ?? false,
      priority: data.priority ?? 0,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      position: data.position ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  public updateItem(
    id: number,
    fields: Partial<Omit<ListItemModel, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const item = this.getItemById(id);
    if (!item) return null;
    if (fields.title !== undefined) item.title = fields.title;
    if (fields.description !== undefined) item.description = fields.description;
    if (fields.completed !== undefined) item.completed = fields.completed;
    if (fields.priority !== undefined) item.priority = fields.priority;
    if (fields.position !== undefined) item.position = fields.position;
    if (fields.dueDate !== undefined) {
      item.dueDate = fields.dueDate
        ? new Date(fields.dueDate).toISOString()
        : null;
    }
    item.updatedAt = new Date().toISOString();
    return item;
  }

  public deleteItem(id: number) {
    const idx = this.items.findIndex(item => item.id === id);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export const mockDb = new MockDatabase();
