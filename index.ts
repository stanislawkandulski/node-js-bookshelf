import { readFile, writeFile } from "node:fs/promises";

interface Book {
  title: string;
  author: string;
  pages: number;
  year: number;
  read: boolean;
  rating: number | null;
}

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

async function parseData(raw: string): Promise<Book[]> {
  try {
    return JSON.parse(raw) as Book[];
  } catch (error) {
    throw new Error("Malformed JSON", { cause: error });
  }
}

async function main() {
  const raw = await loadFile("books.json");
  const parsedBooks = await parseData(raw);
  return parsedBooks;
}

const args = process.argv.slice(2);
if (args.includes("--addBook")) {
  try {
    const defaultBookEntry: Book = {
      title: "Untitled",
      author: "Unassigned",
      pages: 0,
      year: 0,
      read: false,
      rating: null,
    };
    const newBookEntry: Partial<Book> = {};

    args.forEach((value, index) => {
      switch (value) {
        case "--title":
          newBookEntry.title = args[index + 1] ?? "Unknown";
          break;
        case "--year":
          newBookEntry.year = Number(args[index + 1] ?? 0);
          break;
        case "--author":
          newBookEntry.author = args[index + 1] ?? "Unknown";
          break;
        case "--pages":
          newBookEntry.pages = Number(args[index + 1] ?? 0);
          break;
        case "--read":
          newBookEntry.read = args[index + 1] === "true";
          break;
        case "--rating":
          newBookEntry.rating =
            args[index + 1] === undefined || args[index + 1] === "null"
              ? null
              : Number(args[index + 1]);
          break;
      }
    });
    const finalBookEntry: Book = { ...defaultBookEntry, ...newBookEntry };
    const existingRaw = await loadFile("books.json");
    const existingBooks = await parseData(existingRaw);
    existingBooks.push(finalBookEntry);
    await writeFile("books.json", JSON.stringify(existingBooks, null, 2));

    console.log(newBookEntry);
  } catch (error) {
    console.log(error);
  }
}
// const raw = await loadFile('books.json')
// const myBooks = await parseData(raw)

// number of books
// console.log("Number of books: ", parsedBooks.length);

// number of read books
// const filtered = parsedBooks.filter((book) => book.read === false);

// console.log("Number of read books: ", filtered.length);

// number of pages
// const arrayOfPages = [];
// await parsedBooks.map((book) => {
//   arrayOfPages.push(book.pages);
// });
// console.log(arrayOfPages);

// console.log(arrayOfPages.reduce((acc, currentValue) => acc + currentValue, 0));

// report
// console.table(parsedBooks.sort((bookA, bookB) => bookA.pages - bookB.pages));

// node arguments
// console.log(process.argv);

// const args = process.argv.slice(2);
// if (args.includes("--unread")) {
//   const unread = parsedBooks.filter((book) => book.read === false);
//   console.log(unread);
// }
