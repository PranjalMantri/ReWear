import { z } from "zod";

export const signupSchema = z
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

export const signinSchema = z.object({
  email: z.email("Invalid Email"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const user = z.object({
  _id: z.string(),
  email: z.string(),
  fullname: z.string(),
  profilePicture: z.string().optional(),
  points: z.number(),
});
