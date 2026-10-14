import { create } from 'zustand';
import { familyApi, getApiErrorMessage } from '@api';
import type { FamilyModel } from '@api/contracts';

interface FamilyState {
  family: FamilyModel | null;
  loading: boolean;
  error: string | null;
  loadFamily: () => Promise<void>;
  addMember: (email: string) => Promise<boolean>;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  family: null,
  loading: false,
  error: null,

  async loadFamily() {
    set({ loading: true, error: null });
    try {
      const response = await familyApi.getFamily();
      set({ family: response.data.data, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося завантажити родину'), loading: false });
    }
  },

  async addMember(email) {
    set({ error: null });
    try {
      await familyApi.addMember({ email });
      await get().loadFamily();
      return true;
    } catch (error) {
      set({ error: getApiErrorMessage(error, 'Не вдалося додати учасника') });
      return false;
    }
  },
}));
