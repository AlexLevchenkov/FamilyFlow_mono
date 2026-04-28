import {
  LoginPage,
  ForgotPasswordPage,
  VerifyEmailPage,
  RegistrationPage,
} from "@/pages";

export const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/registration", element: <RegistrationPage /> },
];