export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class StorageError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500);
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}
