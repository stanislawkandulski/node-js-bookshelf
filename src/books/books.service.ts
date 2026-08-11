import type { Book } from "./types.ts";

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
