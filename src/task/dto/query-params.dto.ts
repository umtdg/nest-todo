import { ApiProperty } from '@nestjs/swagger';

export enum TaskSortBy {
  Id = 'id',
  Title = 'title',
  Status = 'status',
  CreationDate = 'createdAt',
  RecentlyUpdated = 'updatedAt',
  Assignee = 'assignee',
}

export enum TaskSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class SortParams {
  @ApiProperty()
  sortBy?: TaskSortBy;

  @ApiProperty()
  sortDirection?: TaskSortDirection;
}

export class FilterParams {}
