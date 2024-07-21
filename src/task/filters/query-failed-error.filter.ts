import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const sqlState = exception['sqlState'];
    const status = sqlState === '45000' ? 403 : 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
