import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    fullname: z.string().min(3, "Fullname must be at least 3 characters long."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const signinSchema = z.object({
  email: z.email("Invalid Email"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export { signupSchema, signinSchema };
