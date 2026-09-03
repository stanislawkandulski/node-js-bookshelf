import * as z from "zod";

import { ValidationError } from "../errors.ts";
import {
  bookPatchSchema,
  newBookSchema,
  type Book,
  type BookPatch,
  type NewBook,
} from "./books.schema.ts";

function parseWithSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      throw new ValidationError(message);
    }
    throw error;
  }
}

export function parseToNewBook(input: unknown): NewBook {
  return parseWithSchema(newBookSchema, input);
}

export function filterByRead(books: Book[], read: boolean) {
  return books.filter((book) => book.read === read);
}

export function filterBooks(books: Book[], phrase: string) {
  const searchedPhrase = phrase.toLowerCase();
  return books.filter(
    (book) =>
      book.author.toLowerCase().includes(searchedPhrase) ||
      book.title.toLowerCase().includes(searchedPhrase),
  );
}

export function totalPages(books: Book[]) {
  return books.reduce((acc, book) => acc + book.pages, 0);
}

export function sortByPages(parsedBooks: Book[]) {
  return parsedBooks.toSorted((bookA, bookB) => bookA.pages - bookB.pages);
}

export function findBookById(
  parsedBooks: Book[],
  id: number,
): Book | undefined {
  const returnedBook = parsedBooks.find((element) => element.id === id);
  if (returnedBook === undefined) {
    return undefined;
  } else {
    return returnedBook;
  }
}

export function findBooksIndexById(
  books: Book[],
  id: number,
): number | undefined {
  const booksIndex = books.findIndex((book) => book.id === id);

  return booksIndex === -1 ? undefined : booksIndex;
}

export function parseBookPatch(input: unknown): BookPatch {
  const patch = parseWithSchema(bookPatchSchema, input);
  if (Object.keys(patch).length === 0) {
    throw new ValidationError("No valid fields provided to update");
  }
  return patch;
}

export function applyPatch(book: Book, patch: BookPatch): Book {
  return { ...book, ...patch };
}

export function parsedQueryToBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;

  throw new ValidationError("read must be 'true' or 'false'");
}

export function parsedQueryToString(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;

  throw new ValidationError("query parameter must be a single string value");
}

export function filterByAuthor(books: Book[], author: string) {
  return books.filter(
    (book) => book.author.toLowerCase() === author.toLowerCase(),
  );
}