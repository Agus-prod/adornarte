export class Money {
  static add(
    a: number,
    b: number
  ) {
    return Number(
      (a + b).toFixed(2)
    );
  }

  static subtract(
    a: number,
    b: number
  ) {
    return Number(
      (a - b).toFixed(2)
    );
  }

  static multiply(
    a: number,
    b: number
  ) {
    return Number(
      (a * b).toFixed(2)
    );
  }

  static divide(
    a: number,
    b: number
  ) {
    if (b === 0) {
      throw new Error(
        "División entre cero."
      );
    }

    return Number(
      (a / b).toFixed(2)
    );
  }
}