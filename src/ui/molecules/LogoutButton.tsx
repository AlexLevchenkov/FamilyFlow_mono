import { useStore } from "@/store";
import { useLogout } from "@hooks/AuthHooks";
import logoutSVG from "@assets/SVG/Logout.svg";

export const LogoutButton = () => {
  const logout = useLogout();
  const { auth } = useStore();

  const tryLogout = () => {
    logout.mutate(undefined, { onSuccess: () => auth.logout() });
  };

  return (
    <button
      className="h-max inline-flex gap-1 items-center cursor-pointer p-2"
      title="Вийти з акаунта"
      onClick={tryLogout}
    >
      <img className="w-4 h-max" src={logoutSVG} alt="logout" />
      Log Out
    </button>
  );
};