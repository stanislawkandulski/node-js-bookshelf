Architecture: how to manage files and folders

src/
  index.ts              ← starts the server, nothing else
  app.ts                ← builds the express app, registers middleware
  config.ts             ← typed env access (step 3)
  errors.ts             ← custom error classes (step 4)
  books/
    books.routes.ts     ← HTTP: reads req, calls service, sends res
    books.service.ts    ← business logic, no req/res anywhere
    books.repository.ts ← file I/O, the only thing that touches disk
    books.types.ts      ← the Book interface


