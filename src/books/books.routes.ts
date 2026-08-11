import { Router } from "express";

import { loadBooks } from "./books.repository.ts";
import { findBookById } from "./books.service.ts";

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
    res.status(404).json({ message: `No book with ${bookId} ` });
  } else {
    res.json(searchedBook);
  }
});

export default booksRouter;
