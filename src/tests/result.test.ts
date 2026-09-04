import { ok } from "../result.ts";
import { describe, it } from "vitest";
import type { Result } from "../result.ts";

describe("Result", () => {
  it("blocks reading value before checking ok", () => {
    const r: Result<string, string> = ok("x");
    // @ts-expect-error value is not accessible before narrowing
    r.value;
  });
});
