import * as z from "zod";

export const newBookSchema = z
  .object({
    title: z.string().min(1),
    author: z.string().min(1),
    pages: z.number().int().positive(),
    year: z.number().int().gt(999),
    read: z.boolean().default(false),
    rating: z.number().nullable().default(null),
  })
  .strict();

export const bookSchema = newBookSchema.extend({
  id: z.number().int().positive(),
});

export const bookPatchSchema = newBookSchema
  .omit({ read: true, rating: true })
  .partial()
  .extend({
    read: z.boolean().optional(),
    rating: z.number().nullable().optional(),
  })
  .strict();

export type NewBook = z.infer<typeof newBookSchema>;
export type Book = z.infer<typeof bookSchema>;
export type BookPatch = z.infer<typeof bookPatchSchema>;
