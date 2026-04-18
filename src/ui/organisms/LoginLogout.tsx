import { useAuth, useLogin, useLogout } from "@hooks/AuthHooks";
import { authStorage } from "@store/auth";
import AuthButton from "@ui/molecules/AuthButton";

export default function LoginLogout() {
  const login = useLogin();
  const logout = useLogout();
  const isAuth = useAuth();

  const tryLogin = () => {
    login.mutate({
      email: "super@gmail.com",
      password: "Password123!@#",
    },
    {onSuccess: (data) => {
      authStorage.setAccessToken(data.accessToken)
    }});
  };

  const tryLogout = () => {
    logout.mutate(undefined, { onSuccess: () => authStorage.removeAccessToken() });
  };

  return (
    <AuthButton
      isAuth={isAuth}
      onLogin={tryLogin}
      onLogout={tryLogout}
      loading={login.isPending}
      error={login.isError}
    />
  );
};