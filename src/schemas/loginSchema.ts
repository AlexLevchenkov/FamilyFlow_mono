import z from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .max(20)
  .refine((password) => /[A-Z]/.test(password), {message: "Password must contain uppercase letters"})
  .refine((password) => /[a-z]/.test(password), {message: "Password must contain lowercase letters"})
  .refine((password) => /[0-9]/.test(password), {message: "Password must contain numbers"})
  .refine((password) => /[!@#$%^&*]/.test(password), {message: "Password must contain special characters (!@#$%^&*)"});

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    { message: "Invalid email" }
  );

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  password: passwordSchema,
  confirmPassword: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword);

export const setPasswordSchema = z.object({
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const RegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  repeatPassword: passwordSchema,
  name: z.string().trim().min(2).max(32),
  avatar: z.string().optional(),
})


export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type RegistrationData = z.infer<typeof RegistrationSchema>;
