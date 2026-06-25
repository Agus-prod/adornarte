import { BusinessError } from "./BusinessError";

export class Guard {
  static againstNull<T>(
    value: T | null | undefined,
    code: string,
    message: string
  ): T {
    if (value == null) {
      throw new BusinessError(
        code,
        message
      );
    }

    return value;
  }

  static against(
    condition: boolean,
    code: string,
    message: string
  ) {
    if (condition) {
      throw new BusinessError(
        code,
        message
      );
    }
  }
}