import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface PaginationOptions {
  skip: number;
  limit: number;
}

export const PaginationParams = createParamDecorator((_: any, context: ExecutionContext): PaginationOptions => {
  const request: Request = context.switchToHttp().getRequest();

  let pageQuery = request.query['page'] as string;
  let limitQuery = request.query['limit'] as string;

  if (!pageQuery || pageQuery === '') pageQuery = '1';
  if (!limitQuery || limitQuery === '') limitQuery = '20';

  const page = parseInt(pageQuery, 10);
  const limit = parseInt(limitQuery, 10);
  const skip = (page - 1) * limit;

  return { skip, limit };
});
