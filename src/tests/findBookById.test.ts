import { describe, expect, test } from "vitest";
import { findBookById } from "../books/books.service.ts";
import type { Book } from "../books/types.ts";

describe("findBookById", () => {
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
  test("return the first book", async () => {
    expect(findBookById(testArray, 1)).toStrictEqual({
      id: 1,
      title: "Dune",
      author: "Herbert",
      pages: 412,
      year: 1965,
      read: true,
      rating: 5,
    });
  });

  test("return the first book from empty array", async () => {
    const emptyArray: Book[] = [];

    expect(findBookById(emptyArray, 1)).toBe(undefined);
  });
});
