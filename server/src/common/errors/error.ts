export class UniqueConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConstraintError';
  }
}
export class NotFoundError extends Error {
  constructor(message: string = 'Record not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}
