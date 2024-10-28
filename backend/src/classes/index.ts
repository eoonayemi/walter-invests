class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
  }
}

export default CustomError;