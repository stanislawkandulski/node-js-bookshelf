import { describe, expect, test } from "vitest";
import { Money } from "../money.ts";

describe("Money construction", () => {
  test("fromCents preserves the exact cent value", () => {
    expect(Money.fromCents(1999).toCents()).toBe(1999);
  });

  test("fromCents rejects a non-integer", () => {
    expect(() => Money.fromCents(19.99)).toThrow("integer");
  });

  test("fromEuros converts to cents without float error", () => {
    expect(Money.fromEuros(19.99).toCents()).toBe(1999);
  });

  test("the private constructor is the only path, so every Money is valid", () => {
    expect(Money.fromEuros(0.1).toCents()).toBe(10);
    expect(Money.fromEuros(0.07).toCents()).toBe(7);
  });
});

describe("Money arithmetic", () => {
  test("adds without accumulating float error", () => {
    const total = Money.fromEuros(19.99).add(Money.fromEuros(0.01));
    expect(total.toCents()).toBe(2000);
  });

  test("add does not mutate either operand", () => {
    const a = Money.fromCents(1000);
    const b = Money.fromCents(500);

    a.add(b);

    expect(a.toCents()).toBe(1000);
    expect(b.toCents()).toBe(500);
  });

  test("subtract may produce a negative amount", () => {
    const result = Money.fromCents(1000).subtract(Money.fromCents(1500));

    expect(result.toCents()).toBe(-500);
  });

  test("multiply rounds to whole cents", () => {
    // 341 * 0.8 = 272.8
    expect(Money.fromCents(341).multiply(0.8).toCents()).toBe(273);
  });

  test("percentage takes a share of the amount", () => {
    // 20% of 341 = 68.2
    expect(Money.fromCents(341).percentage(20).toCents()).toBe(68);
  });
});

describe("Money comparison", () => {
  test("equal amounts are equal by value, not identity", () => {
    const a = Money.fromCents(100);
    const b = Money.fromCents(100);

    expect(a === b).toBe(false);
    expect(a.equals(b)).toBe(true);
  });

  test("different amounts are not equal", () => {
    expect(Money.fromCents(100).equals(Money.fromCents(101))).toBe(false);
  });
});

describe("Money formatting", () => {
  test("formats a whole amount with two decimal places", () => {
    expect(Money.fromCents(1999).toString()).toBe("19.99");
  });

  test("pads a single-digit remainder", () => {
    expect(Money.fromCents(1905).toString()).toBe("19.05");
  });

  test("formats an amount under one euro", () => {
    expect(Money.fromCents(5).toString()).toBe("0.05");
  });

  test("formats a negative amount", () => {
    expect(Money.fromCents(-1999).toString()).toBe("-19.99");
  });
});
