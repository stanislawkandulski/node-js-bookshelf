import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors.ts";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
