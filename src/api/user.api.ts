import { api } from "./client";

export interface User {
  id: string;
  email: string;
}

export const userApi = {
  me() {
    return api.get("/users/me");
  },
};
