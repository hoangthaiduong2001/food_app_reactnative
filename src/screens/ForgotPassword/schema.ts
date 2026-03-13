import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
