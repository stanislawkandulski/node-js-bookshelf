import { type FastifyInstance } from "fastify";
import { NotFoundError } from "../errors.ts";
import { loadBooks, saveBooks } from "./books.repository.ts";
import type { Book } from "./books.schema.ts";
import {
  applyPatch,
  filterBooks,
  filterByAuthor,
  filterByRead,
  findBookById,
  findBooksIndexById,
  parseBookPatch,
  parsedQueryToBoolean,
  parsedQueryToString,
  parseToNewBook,
} from "./books.service.ts";

export async function booksRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: Record<string, unknown> }>(
    "/",
    async (request, reply) => {
      const readValue = parsedQueryToBoolean(request.query["read"]);
      const searchValue = parsedQueryToString(request.query["search"]);
      const authorValue = parsedQueryToString(request.query["author"]);

      let returnedBooks = await loadBooks();

      if (readValue !== undefined) {
        returnedBooks = filterByRead(returnedBooks, readValue);
      }
      if (authorValue !== undefined) {
        returnedBooks = filterByAuthor(returnedBooks, authorValue);
      }
      if (searchValue !== undefined) {
        returnedBooks = filterBooks(returnedBooks, searchValue);
      }

      return returnedBooks;
    },
  );

  fastify.get<{ Params: { id: string } }>("/:id", async (request) => {
    const loadedBooks = await loadBooks();
    const bookId = Number(request.params["id"]);
    const searchedBook = findBookById(loadedBooks, bookId);

    if (searchedBook === undefined) {
      throw new NotFoundError(`No book with id ${bookId}`);
    }

    return searchedBook;
  });

  fastify.post<{ Body: unknown }>("/", async (request, reply) => {
    const newBook = parseToNewBook(request.body);
    const loadedBooks = await loadBooks();

    const allIds: number[] = [];
    loadedBooks.forEach((book) => {
      allIds.push(book.id);
    });
    const highestId = allIds.toSorted((bookA, bookB) => bookA - bookB).at(-1);
    const nextId = highestId === undefined ? 1 : highestId + 1;

    const book: Book = { id: nextId, ...newBook };

    loadedBooks.push(book);
    await saveBooks(loadedBooks);

    reply.code(201);
    return book;
  });

  fastify.patch<{ Params: { id: string } }>("/:id", async (request) => {
    const bookId = Number(request.params["id"]);
    const patch = parseBookPatch(request.body);

    const loadedBooks = await loadBooks();
    const index = findBooksIndexById(loadedBooks, bookId);

    if (index === undefined) {
      throw new NotFoundError(`No book with id ${bookId}`);
    }

    const updated = applyPatch(loadedBooks[index]!, patch);
    loadedBooks[index] = updated;

    await saveBooks(loadedBooks);
    return updated;
  });

  fastify.put<{ Params: { id: string } }>("/:id", async (request) => {
    const bookId = Number(request.params["id"]);
    const replacement = parseToNewBook(request.body);

    const loadedBooks = await loadBooks();
    const index = findBooksIndexById(loadedBooks, bookId);

    if (index === undefined) {
      throw new NotFoundError(`No book with id ${bookId}`);
    }

    const updated: Book = { id: bookId, ...replacement };
    loadedBooks[index] = updated;

    await saveBooks(loadedBooks);
    return updated;
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const loadedBooks = await loadBooks();
    const bookId = Number(request.params["id"]);
    const index = findBooksIndexById(loadedBooks, bookId);

    if (index === undefined) {
      throw new NotFoundError(`No book with id ${bookId}`);
    }

    loadedBooks.splice(index, 1);
    await saveBooks(loadedBooks);
    reply.code(204);
  });
}
