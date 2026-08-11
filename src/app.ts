import express from "express";
import booksRouter from "./books/books.routes.ts";

const app = express();

app.use("/books", booksRouter);

export default app;
