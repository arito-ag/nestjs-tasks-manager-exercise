import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TRANSACTION_TYPES } from 'src/transactions/constants/types';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly transactionsService: TransactionsService) {}
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '';
    const isHttpException = exception instanceof HttpException;
    if (isHttpException) message = exception.getResponse()['message'];

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });

    const description = `Error occurred: ${exception.toString()} with message: ${message}`;
    await this.transactionsService.create({
      type: TRANSACTION_TYPES.ERROR,
      description,
    });
  }
}
