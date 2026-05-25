import { z } from "zod";

// Shared schemas
const titlePrefixSchema = z.string().max(10, "Title prefix is too long").nullable().optional();
const nameSchema = z.string().min(1, "Name is required").max(50, "Name cannot exceed 50 characters").trim();
const middleInitialSchema = z.string().max(5, "Middle initial is too long").trim().nullable().optional();
const bioSchema = z.string().max(500, "Bio cannot exceed 500 characters").trim().nullable().optional();

export const profileUpdateSchema = z.object({
  title_prefix: titlePrefixSchema,
  first_name: nameSchema,
  middle_initial: middleInitialSchema,
  last_name: nameSchema,
  bio: bioSchema,
});

export const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters").max(500, "Question cannot exceed 500 characters").trim(),
});
