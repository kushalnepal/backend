import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]),
});
