import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must contain at least 3 characters")
      .max(50, "Username cannot exceed 50 characters"),

    email: z.email("Invalid email format"),
    phone: z
      .string()
      .trim()
      .regex(
        /^(0|\+84)[0-9]{9}$/,
        "Phone number must be a valid Vietnamese phone number",
      ),
    address: z
      .string()
      .trim()
      .min(5, "Address must contain at least 5 characters")
      .max(255, "Address cannot exceed 255 characters"),
    password: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password do not match with password",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
