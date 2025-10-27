export class UniqueConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConstraintError';
  }
}
export class NotFoundError extends Error {
  constructor(message: string = 'Запис не знайдено.') {
    super(message);
    this.name = 'NotFoundError';
  }
}
