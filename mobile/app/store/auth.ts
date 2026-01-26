import * as SecureStore from "expo-secure-store";
import { initAuthStorage } from "@common/store/auth"

initAuthStorage({
  async getAccessToken() {
    return await SecureStore.getItemAsync("familyflow_access_token");
  },
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync("familyflow_access_token", token);
  },
  async clear() {
    await SecureStore.deleteItemAsync("familyflow_access_token");
  },
});
