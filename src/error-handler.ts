import {
  type FastifyError,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import { AppError } from "./errors.ts";

export function createErrorHandler() {
  return function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    if (error instanceof AppError) {
      reply
        .code(error.status)
        .send({ key: error.key, title: error.message, status: error.status });

      return;
    }

    if (
      error.statusCode !== undefined &&
      error.statusCode >= 400 &&
      error.statusCode <= 500
    ) {
      reply.code(error.statusCode).send({
        key: "BAD_REQUEST",
        title: error.message,
        status: error.statusCode,
      });

      return;
    }

    request.log.error(error);
    reply.code(500).send({
      key: "INTERNAL_ERROR",
      title: "Internal server error",
    });
  };
}
