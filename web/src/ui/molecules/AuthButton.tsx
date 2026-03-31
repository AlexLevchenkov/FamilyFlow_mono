import { colors, gradient, spacing, radius, fontSize, fontWeight, fontFamily } from "@familyflow/common/styles/index";
import Button from "@ui/atoms/Button";

type AuthButtonProps = {
  isAuth: boolean;
  onLogin: () => void;
  onLogout: () => void;
  loading?: boolean;
  error?: boolean;
};

const styles = {
  background: gradient.buttonFill,
  color: colors.white,
  padding: `${spacing.sm}px ${spacing.md}px`,
  fontSize: fontSize.lg,
  fontWeight: fontWeight.regular,
  fontFamily: fontFamily.main,
  borderRadius: radius.main,
  border: "none",
  width: "min(30vw, 160px)"
}

export default function AuthButton({ isAuth, onLogin, onLogout, loading, error }: AuthButtonProps) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error</p>;

  return isAuth ? (
    <div style={{ color: "green" }}>
      You are authorized <Button style={styles} onClick={onLogout}>Logout</Button>
    </div>
  ) : (
    <Button style={styles} onClick={onLogin}>Login</Button>
  );
};
