import { initAuthStorage } from "@store/auth";

initAuthStorage({
  getAccessToken: () => localStorage.getItem("access_token"),
  setAccessToken: (token: string) => localStorage.setItem("access_token", token),
  removeAccessToken: () => localStorage.removeItem("access_token"),
});
