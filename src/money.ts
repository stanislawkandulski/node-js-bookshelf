export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    this.cents = cents;
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      throw new Error("Number of cents should be an integer");
    }
    return new Money(cents);
  }

  static fromEuros(euros: number): Money {
    return Money.fromCents(Math.round(euros * 100));
  }

  add(other: Money): Money {
    return Money.fromCents(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return Money.fromCents(this.cents - other.cents);
  }

  multiply(factor: number): Money {
    return Money.fromCents(Math.round(this.cents * factor));
  }

  percentage(percent: number): Money {
    return this.multiply(percent / 100);
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    const isNegative = this.cents < 0;
    const absolute = Math.abs(this.cents);

    const euros = Math.floor(absolute / 100);
    const remainder = absolute % 100;

    const formatted = `${euros}.${String(remainder).padStart(2, "0")}`;

    return isNegative ? `-${formatted}` : formatted;
  }

  toCents(): number {
    return this.cents;
  }
}
