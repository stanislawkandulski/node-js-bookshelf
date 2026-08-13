import { Router } from "express";

import { NotFoundError } from "../errors.ts";
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
    throw new NotFoundError(`No book with id ${bookId}`);
  } else {
    res.json(searchedBook);
  }
});



export default booksRouter;
