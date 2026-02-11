import { useAuth, useLogin, useLogout } from "@familyflow/common/hooks/AuthHooks";
import { authStorage } from "@familyflow/common/store/auth"

export default function App() {
  const login = useLogin("WEB");
  const logout = useLogout("WEB");
  const isAuth = useAuth();

  const tryLogin = () => {
    login.mutate({
      email: "super@gmail.com",
      password: "password",
    },
    {onSuccess: (data) => {
      authStorage.setAccessToken(data.accessToken)
    }});
  };

  const tryLogout = () => {
    logout.mutate(undefined, {onSuccess: () => authStorage.setAccessToken("")});
  };

  if (isAuth) return <p>You are authorized <button onClick={tryLogout}>Logout</button></p>;

  if (login.isPending) return <p>Loading...</p>;
  if (login.isError) return <p>Error</p>;

  return <div>
    <button onClick={tryLogin}>Login</button>
  </div>;
}
