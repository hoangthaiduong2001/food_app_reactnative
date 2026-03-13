import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm new password do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
