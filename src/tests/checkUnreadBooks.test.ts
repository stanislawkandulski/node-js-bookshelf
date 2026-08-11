import { describe, expect, test } from "vitest";
import { filterByRead } from "../books/books.service.ts";
import type { Book } from "../books/types.ts";

describe("filterByRead", () => {
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

  test("returns unread books when read=false", async () => {
    expect(filterByRead(testArray, false)).toHaveLength(1);
  });

  test("returns read books when read=true", async () => {
    expect(filterByRead(testArray, true)).toHaveLength(1);
  });

  test("returns an empty array when given no books", () => {
    const emptyArray: Book[] = [];

    expect(filterByRead(emptyArray, true)).toHaveLength(0);
  });
});
