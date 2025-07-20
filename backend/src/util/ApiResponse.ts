class ApiResponse extends Error {
  public statusCode: number;
  public errors?: unknown;
  public data: unknown;
  public success: true;

  constructor(statusCode: number, message: string, data: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export default ApiResponse;
