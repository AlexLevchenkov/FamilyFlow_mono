import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi, LoginDto } from "../api";
import { authStorage } from "../store/auth";

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });
}

export function useAuth() {
  const [isAuth, setIsAuth] = useState()
  return authStorage && !!authStorage.getAccessToken();
}
