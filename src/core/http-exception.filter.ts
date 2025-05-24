
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { error } from 'console';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        // statusCode: status,
        // timestamp: new Date().toISOString(),
        // path: request.url,
        error: "Payload too large",
        message: "The request payload is too large. Customize the limit in the Multer configuration.",
        statusCode: status,
      });
  }
}
