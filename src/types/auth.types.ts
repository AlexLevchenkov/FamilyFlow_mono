export interface User {
  id: number;
  email: string;
  password?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ChangePasswordResponse {
  oldPassword: string;
  newPassword: string;
}

export interface SetPasswordResponse {
  newPassword: string;
}
