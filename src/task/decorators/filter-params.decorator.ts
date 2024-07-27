import { createParamDecorator, ExecutionContext, NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';
import { ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';

export enum FilterRule {
  EQUAL = 'eq',
  NOT_EQUAL = 'neq',
  GREATER = 'gt',
  GREATER_OR_EQUAL = 'gte',
  LESS = 'lt',
  LESS_OR_EQUAL = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'notlike',
  IN = 'in',
  NOT_IN = 'notin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}
const validRules: FilterRule[] = Object.values(FilterRule);

export interface FilterOptions {
  property: string;
  rule: string;
  value: string;
}

export function filterOptionToTypeOrm(filter: FilterOptions) {
  if (!filter) return {};

  if (filter.rule == FilterRule.IS_NULL) return { [filter.property]: IsNull() };
  if (filter.rule == FilterRule.IS_NOT_NULL) return { [filter.property]: Not(IsNull()) };
  if (filter.rule == FilterRule.EQUAL) return { [filter.property]: filter.value };
  if (filter.rule == FilterRule.NOT_EQUAL) return { [filter.property]: Not(filter.value) };
  if (filter.rule == FilterRule.GREATER) return { [filter.property]: MoreThan(filter.value) };
  if (filter.rule == FilterRule.GREATER_OR_EQUAL) return { [filter.property]: MoreThanOrEqual(filter.value) };
  if (filter.rule == FilterRule.LESS) return { [filter.property]: LessThan(filter.value) };
  if (filter.rule == FilterRule.LESS_OR_EQUAL) return { [filter.property]: LessThanOrEqual(filter.value) };
  if (filter.rule == FilterRule.LIKE) return { [filter.property]: ILike(`%${filter.value}%`) };
  if (filter.rule == FilterRule.NOT_LIKE) return { [filter.property]: Not(ILike(`%${filter.value}%`)) };
  if (filter.rule == FilterRule.IN) return { [filter.property]: In(filter.value.split(',')) };
  if (filter.rule == FilterRule.NOT_IN) return { [filter.property]: Not(In(filter.value.split(','))) };
}

export const FilterParams = createParamDecorator(
  (validParams: string[], context: ExecutionContext): FilterOptions[] => {
    const request: Request = context.switchToHttp().getRequest();
    const filterQuery = request.query['filter'] as string;
    if (!filterQuery) return [];

    let filter: string[] = filterQuery.split(';');
    let filterOptions: FilterOptions[] = [];

    for (let i = 0; i < filter.length; i++) {
      let [property, rule, value, _] = filter[i].split(':').map((x) => x.trim());
      if (!property || !rule || !value) continue;

      rule = rule.toLowerCase();

      if (!validParams.includes(property)) {
        throw new NotAcceptableException(
          `Cannot filter by ${property}. Allowed properties: [${validParams.join(', ')}]`,
        );
      }

      if (!validRules.includes(rule as FilterRule)) {
        throw new NotAcceptableException(`Invalid filter rule ${rule}. Allowed rules: [${validRules.join(', ')}]`);
      }

      filterOptions.push({ property, rule, value });
    }

    return filterOptions;
  },
);
