import express from "express";
import booksRouter from "./books/books.routes.ts";
import { errorHandler } from "./middleware/error-handler.ts";

const app = express();

app.use("/books", booksRouter);
app.use(errorHandler);

export default app;
