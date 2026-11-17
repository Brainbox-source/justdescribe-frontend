export class ApiError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
  }
}
