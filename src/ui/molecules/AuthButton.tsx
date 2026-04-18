import Button from "@ui/atoms/Button";

type AuthButtonProps = {
  isAuth: boolean;
  onLogin: () => void;
  onLogout: () => void;
  loading?: boolean;
  error?: boolean;
};

const stylesClasses = "text-red-950 bg-gradient-to-b from-background1 to-background2 text-background";

export default function AuthButton({ isAuth, onLogin, onLogout, loading, error }: AuthButtonProps) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error</p>;

  return isAuth ? (
    <div className="text-green-500">
      You are authorized <Button className={`${stylesClasses}`} onClick={onLogout}>Logout</Button>
    </div>
  ) : (
    <Button className={`${stylesClasses}`} onClick={onLogin}>Login</Button>
  );
};
