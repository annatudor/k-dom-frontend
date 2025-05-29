export interface PagedFilterDto {
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}
