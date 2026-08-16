import { ValidationError } from "../errors.ts";
import type { Book } from "./types.ts";

export type NewBook = Omit<Book, "id">;

export function parseToNewBook(input: unknown): NewBook {
  const errors: string[] = [];

  if (typeof input !== "object" || input === null) {
    throw new ValidationError("Request body must be an object");
  }

  const { title, author, pages, year, read, rating } = input as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || title.trim() === "") {
    errors.push("title must be a non-empty string");
  }
  if (typeof author !== "string" || author.trim() === "") {
    errors.push("author must be a non-empty string");
  }
  if (typeof pages !== "number" || !Number.isInteger(pages) || pages <= 0) {
    errors.push("pages must be a positive integer");
  }
  if (typeof year !== "number" || !Number.isInteger(year)) {
    errors.push("year must be an integer");
  }
  if (read !== undefined && typeof read !== "boolean") {
    errors.push("read must be a boolean");
  }
  if (rating !== null && rating !== undefined && typeof rating !== "number") {
    errors.push("rating must be a number or null");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join("; "));
  }

  return {
    title: title as string,
    author: author as string,
    pages: pages as number,
    year: year as number,
    read: read as boolean ?? false,
    rating: (rating as number | null) ?? null,
  };
}

export function filterByRead(books: Book[], read: boolean) {
  return books.filter((book) => book.read === read);
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


