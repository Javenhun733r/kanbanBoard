import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError, UniqueConstraintError } from '@app/common/errors/error';

interface DatabaseError {
  code?: string;
  name?: string;
}
interface ErrorHandlerResult {
  status: HttpStatus;
  message: string;
}
const ERROR_HANDLERS: {
  [key: string]: (exception: DatabaseError) => ErrorHandlerResult;
} = {
  [UniqueConstraintError.name]: () => ({
    status: HttpStatus.CONFLICT,
    message: 'The resource with this unique identifier already exists.',
  }),
  [NotFoundError.name]: (ex: NotFoundError) => ({
    status: HttpStatus.NOT_FOUND,
    message: ex.message,
  }),
  ECONNREFUSED: () => ({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message:
      'Database service is currently unavailable. Please try again later.',
  }),
  ConnectionError: () => ({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message:
      'Database service is currently unavailable. Please try again later.',
  }),
};

const DEFAULT_ERROR_HANDLER: ErrorHandlerResult = {
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  message: 'Internal server error.',
};

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let handlerResult: ErrorHandlerResult = DEFAULT_ERROR_HANDLER;
    let logUnhandled = true;

    if (exception instanceof Error) {
      const error = exception as DatabaseError;

      let handler = ERROR_HANDLERS[error.constructor.name];
      if (!handler) {
        handler =
          ERROR_HANDLERS[error.code as string] ||
          ERROR_HANDLERS[error.name as string];
      }

      if (handler) {
        handlerResult = handler(error);
        logUnhandled = false;
      }
    }
    if (
      logUnhandled &&
      handlerResult.status === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      console.error('Unhandled Server Exception:', exception);
    }

    response.status(handlerResult.status).json({
      statusCode: handlerResult.status,
      message: handlerResult.message,
      timestamp: new Date().toISOString(),
    });
  }
}
