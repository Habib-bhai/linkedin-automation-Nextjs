import z from "zod";

export const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((file) => file.type === "text/csv", "File must be a CSV")
  .refine((file) => file.size <= 10 * 1024 * 1024, "File must be <= 10MB");

export const updateLeadSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  profileUrl: z.string().url().optional(),
});