import { initAuthStorage } from "@common/store/auth"

initAuthStorage({
  getAccessToken() {
    console.log("getAccessToken");
    return localStorage.getItem("access_token");
  },
  setAccessToken(token: string) {
    console.log("setAccessToken", token);
    
    localStorage.setItem("access_token", token);
  },
  clear() {
    localStorage.removeItem("access_token");
  },
});
