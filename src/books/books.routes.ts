import { Router } from "express";

import { NotFoundError } from "../errors.ts";
import { loadBooks, saveBooks } from "./books.repository.ts";
import { findBookById, parseToNewBook } from "./books.service.ts";
import type { Book } from "./types.ts";

const booksRouter = Router();

booksRouter.get("/", async (_req, res) => {
  const loadedBooks = await loadBooks();
  res.json(loadedBooks);
});

booksRouter.get("/:id", async (req, res) => {
  const loadedBooks = await loadBooks();
  const bookId = Number(req.params["id"]);
  const searchedBook = findBookById(loadedBooks, bookId);
  if (searchedBook === undefined) {
    throw new NotFoundError(`No book with id ${bookId}`);
  } else {
    res.json(searchedBook);
  }
});

booksRouter.post("/", async (req, res) => {
  const newBook = parseToNewBook(req.body);
  const loadedBooks = await loadBooks();

  let allIds: number[] = [];
  loadedBooks.forEach((book) => {
    allIds.push(book.id);
  });
  const highestId = allIds.toSorted((bookA, bookB) => bookA - bookB).at(-1);
  const nextId = highestId === undefined ? 1 : highestId + 1;

  const book: Book = { id: nextId, ...newBook };

  loadedBooks.push(book);
  await saveBooks(loadedBooks);

  res.status(201).json(book);
});

export default booksRouter;
