class ApiError extends Error {
  public statusCode: number;
  public errors?: unknown;
  public data: null = null;
  public success: false = false;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);

    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);

    this.errors = errors;
  }
}

export default ApiError;
