import { createParamDecorator, ExecutionContext, NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  by: string;
  order?: SortOrder;
}

export const SortParams = createParamDecorator((validParams: string[], context: ExecutionContext): SortOptions => {
  const request: Request = context.switchToHttp().getRequest();
  const sort = request.query['sort'] as string;
  if (!sort) return null;

  let [by, order] = sort.split(':');
  if (!validParams.includes(by)) {
    throw new NotAcceptableException(`Sorting by ${by} is not allowed in this context`);
  }

  order = order.toLowerCase();
  return {
    by,
    order: order === 'desc' ? 'desc' : 'asc',
  };
});
