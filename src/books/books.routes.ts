import { Router } from "express";

import { NotFoundError } from "../errors.ts";
import { loadBooks, saveBooks } from "./books.repository.ts";
import {
  applyPatch,
  filterBooks,
  filterByRead,
  findBookById,
  findBooksIndexById,
  parseBookPatch,
  parsedQueryToBoolean,
  parsedQueryToString,
  parseToNewBook,
} from "./books.service.ts";
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

booksRouter.get("/", async (req, res) => {
  const loadedBooks = await loadBooks();
  const readValue = parsedQueryToBoolean(req.query["read"]);
  const searchValue = parsedQueryToString(req.query["search"]);
  const authorValue = parsedQueryToString(req.query["author"]);

  let returnedBooks = await loadBooks();

  if (readValue !== undefined) {
    return filterByRead(returnedBooks, readValue);
  }
  if (searchValue !== undefined) {
    return filterBooks(returnedBooks, searchValue);
  }
  if (authorValue !== undefined) {
    return filterBooks(returnedBooks, authorValue);
  }

  res.json(returnedBooks);
});

booksRouter.get("/", async (req, res) => {
  const loadedBooks = await loadBooks();
  const readValue = parsedQueryToString(req.query["phrase"]);

  const result =
    readValue === undefined ? loadedBooks : filterBooks(loadedBooks, readValue);

  res.json(result);
});

booksRouter.delete("/:id", async (req, res) => {
  const loadedBooks = await loadBooks();
  const bookId = Number(req.params["id"]);
  const index = findBooksIndexById(loadedBooks, bookId);

  if (index === undefined) {
    throw new NotFoundError(`No book with id ${bookId}`);
  }

  const booksAfterRemoval = loadedBooks.splice(index, 1);
  await saveBooks(loadedBooks);
  res.status(204).send();
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

booksRouter.patch("/:id", async (req, res) => {
  const bookId = Number(req.params["id"]);
  const patch = parseBookPatch(req.body);

  const loadedBooks = await loadBooks();
  const index = findBooksIndexById(loadedBooks, bookId);

  if (index === undefined) {
    throw new NotFoundError(`No book with id ${bookId}`);
  }

  const updated = applyPatch(loadedBooks[index]!, patch);
  loadedBooks[index] = updated;

  await saveBooks(loadedBooks);
  res.json(updated);
});

booksRouter.put("/:id", async (req, res) => {
  const bookId = Number(req.params["id"]);
  const replacement = parseToNewBook(req.body);

  const loadedBooks = await loadBooks();
  const index = findBooksIndexById(loadedBooks, bookId);

  if (index === undefined) {
    throw new NotFoundError(`No book with id ${bookId}`);
  }

  const updated: Book = { id: bookId, ...replacement };
  loadedBooks[index] = updated;

  await saveBooks(loadedBooks);
  res.json(updated);
});

export default booksRouter;
