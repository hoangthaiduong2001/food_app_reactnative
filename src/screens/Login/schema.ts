import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must contain at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
