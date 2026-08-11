import { describe, expect, test } from "vitest";
import { loadBooks } from "../books/books.repository.ts";
import { sortByPages } from "../books/books.service.ts";
import type { Book } from "../books/types.ts";

describe("sortByPages", () => {
  const testArray: Book[] = [
    {
      id: 1,
      title: "Dune",
      author: "Herbert",
      pages: 412,
      year: 1965,
      read: true,
      rating: 5,
    },
    {
      id: 2,
      title: "The Dispossessed",
      author: "Le Guin",
      pages: 341,
      year: 1974,
      read: false,
      rating: 5,
    },
  ];
  test("returns books ordered by page count", async () => {
    const sorted = sortByPages(testArray);

    expect(sorted.map((book) => book.pages)).toEqual(
      [...sorted.map((book) => book.pages)].sort(
        (pagesA, pagesB) => pagesA - pagesB,
      ),
    );
  });

  test("does not mutate the input array", async () => {
    const parsedBooks = await loadBooks();
    const originalSnapshot = [...parsedBooks];

    sortByPages(parsedBooks);

    expect(parsedBooks).toEqual(originalSnapshot);
  });
});
