import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Response as ExpressResponse } from 'express';

type Response<T> = {
  success: boolean;
  code: number;
  data: T;
};

type ResponseError = {
  success: boolean;
  code: number;
  error?: string;
  message?: any;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => this.handleSuccess(context, data)),
      catchError((error: Error) => this.handleFailure(error)),
    );
  }

  handleSuccess(context: ExecutionContext, data: T) {
    const http: HttpArgumentsHost = context.switchToHttp();
    const response: ExpressResponse = http.getResponse();
    const code: number = response.statusCode;
    return {
      success: true,
      code: code,
      data: data,
    };
  }

  handleFailure(error: Error) {
    return throwError((): never => {
      const responseError: ResponseError = {
        success: false,
        code: 500,
        error: error.name,
      };

      if (error instanceof HttpException) {
        responseError.code = Number(error.getStatus());
        const { error: err, message: msg } = error.getResponse() as {
          error?: string;
          message?: unknown;
        };
        if (err) responseError.error = err;
        if (msg) responseError.message = msg;
      }
      throw new HttpException(responseError, responseError.code);
    });
  }
}
