import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpFormType = z.infer<typeof verifyOtpSchema>;
