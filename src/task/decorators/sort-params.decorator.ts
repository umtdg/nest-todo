import { createParamDecorator, ExecutionContext, NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
const validOrders: SortOrder[] = Object.values(SortOrder);

export interface SortOptions {
  by: string;
  order?: string;
}

export function sortOptionsToTypeOrm(sort: SortOptions) {
  if (!sort) return {};

  if (sort.order == SortOrder.ASC) return { [sort.by]: 'asc' };
  if (sort.order == SortOrder.DESC) return { [sort.by]: 'desc' };
}

export const SortParams = createParamDecorator((validParams: string[], context: ExecutionContext): SortOptions => {
  const request: Request = context.switchToHttp().getRequest();
  const sort = request.query['sort'] as string;
  if (!sort) return { by: 'createdAt', order: 'desc' };

  let [by, order] = sort.split(':').map((x) => x.trim());

  if (!order || order === '') order = 'asc';
  order = order.toLowerCase();

  if (!validParams.includes(by)) {
    throw new NotAcceptableException(`Cannot sort by ${by}. Allowed properties: [${validParams.join(', ')}]`);
  }

  if (!validOrders.includes(order as SortOrder)) {
    throw new NotAcceptableException(`Invalid sort order ${order}. Allowed orders: [${validOrders.join(', ')}]`);
  }

  return { by, order };
});
