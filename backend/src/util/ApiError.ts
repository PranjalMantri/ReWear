class ApiError extends Error {
  public statusCode: number;
  public errors?: unknown;
  public data: null;
  public success: false;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;
  }
}

export default ApiError;
