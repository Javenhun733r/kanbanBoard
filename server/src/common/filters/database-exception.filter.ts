import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError, UniqueConstraintError } from '../errors/error';

interface DatabaseError {
  code?: string;
  name?: string;
  message?: string;
}

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unknown database error occurred.';

    if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.CONFLICT;
      message = 'The resource with this unique identifier already exists.';
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof Error) {
      const error = exception as DatabaseError;

      if (error.code === 'ECONNREFUSED' || error.name === 'ConnectionError') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message =
          'Database service is currently unavailable. Please try again later.';
      } else {
        console.error('Unhandled Database Error:', exception);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error.';
      }
    } else {
      console.error('Unhandled non-Error exception:', exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error.';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
