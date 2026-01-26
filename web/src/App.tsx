import { useAuth, useLogin } from "@common/hooks/AuthHooks";
import { useEffect } from "react";
import { authStorage } from "@common/store/auth"

export default function App() {
  const login = useLogin();
  const isAuth = useAuth();

  const onSubmit = () => {
    login.mutate({
      email: "super@gmail.com",
      password: "password",
    });
  };

  useEffect(() => {
    if (login.data && login.data.accessToken) {
      authStorage.setAccessToken(login.data?.accessToken);
    }
  }, [login.data])

  if (isAuth) return <p>You are authorized</p>;

  if (login.isPending) return <p>Loading...</p>;
  if (login.isError) return <p>Error</p>;

  return <button onClick={onSubmit}>Login</button>;
}
