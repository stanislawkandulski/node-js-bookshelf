export type Result<Success, Failure> =
  | { ok: true; value: Success }
  | { ok: false; error: Failure };

export function ok<Success>(value: Success): Result<Success, never> {
  return { ok: true, value };
}

export function err<Failure>(error: Failure): Result<never, Failure> {
  return { ok: false, error };
}
