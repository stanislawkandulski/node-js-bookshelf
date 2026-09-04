export class AppError extends Error {
  readonly status: number;
  readonly key: string;

  constructor(message: string, status: number, key: string) {
    super(message);
    this.status = status;
    this.key = key;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "Not found");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "Validation failed");
  }
}

export class StorageError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 500, "Storage error");
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}
