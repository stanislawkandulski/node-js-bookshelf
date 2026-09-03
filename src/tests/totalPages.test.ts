import { describe, expect, test } from "vitest";
import { totalPages } from "../books/books.service.ts";
import type { Book } from "../books/books.schema.ts";

describe("totalPages", () => {
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

  test("returns number of all pages", async () => {
    expect(totalPages(testArray)).toBe(753);
  });

  test("returns zero pages from empty book array", async () => {
    const emptyArray: Book[] = [];
    expect(totalPages(emptyArray)).toBe(0);
  });
});
