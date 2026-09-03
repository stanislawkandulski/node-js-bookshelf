import { readFile, writeFile } from "node:fs/promises";
import { config } from "../config.ts";
import { StorageError } from "../errors.ts";
import type { Book } from "./books.schema.ts";

async function loadFile(path: string, encoding: BufferEncoding = "utf-8") {
  try {
    return await readFile(path, encoding);
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      if (error.code === "ENOENT")
        throw new StorageError(`No such file: ${path}`, { cause: error });
      if (error.code === "EACCES")
        throw new StorageError(`No permission to read: ${path}`, {
          cause: error,
        });
    }
    throw error;
  }
}

function parseData(raw: string): Book[] {
  try {
    return JSON.parse(raw) as Book[];
  } catch (error) {
    throw new StorageError("Malformed JSON", { cause: error });
  }
}

export async function loadBooks() {
  const raw = await loadFile(config.dataFile);
  return parseData(raw);
}

export async function saveBooks(books: Book[]) {
  try {
    await writeFile(config.dataFile, JSON.stringify(books, null, 2));
  } catch (error) {
    throw new StorageError(`Failed to write: ${config.dataFile}`, {
      cause: error,
    });
  }
}
