import Fastify from "fastify";
import { booksRoutes } from "./books/books.routes.ts";
import { createErrorHandler } from "./error-handler.ts";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(booksRoutes, { prefix: "/books" });

  app.setErrorHandler(createErrorHandler());
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      key: "ROUTE_NOT_FOUND",
      title: `Route ${request.method}:${request.url} not found`,
      status: 404,
    });
  });
  return app;
}
