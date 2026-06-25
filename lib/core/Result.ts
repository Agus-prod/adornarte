export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      code?: string;
    };

export function ok<T>(
  data: T
): Result<T> {
  return {
    success: true,
    data,
  };
}

export function fail(
  error: string,
  code?: string
): Result<never> {
  return {
    success: false,
    error,
    code,
  };
}