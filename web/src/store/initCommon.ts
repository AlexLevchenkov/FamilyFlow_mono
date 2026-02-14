import { initAuthStorage } from "@familyflow/common/store/auth";

initAuthStorage({
  mode: "WEB",
  getAccessToken() {
    return localStorage.getItem("access_token");
  },
  setAccessToken(token: string) {
    localStorage.setItem("access_token", token);
  },
  removeAccessToken() {
    localStorage.removeItem("access_token");
  },
});
