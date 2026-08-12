import { readFile, writeFile } from "node:fs/promises";
import { config } from "../config.ts";
import type { Book } from "./types.ts";

async function loadFile(path: string, encoding: BufferEncoding = "utf-8") {
  try {
    return await readFile(path, encoding);
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      if (error.code === "ENOENT") throw new Error("No such file");
      if (error.code === "EACCES")
        throw new Error("No permission to read path");
    }
    throw error;
  }
}

function parseData(raw: string): Book[] {
  try {
    return JSON.parse(raw) as Book[];
  } catch (error) {
    throw new Error("Malformed JSON", { cause: error });
  }
}

export async function loadBooks() {
  const raw = await loadFile(config.dataFile);
  const parsedBooks = parseData(raw);
  return parsedBooks;
}

export async function saveBooks(books: Book[]) {
  await writeFile(config.dataFile, JSON.stringify(books, null, 2));
}
