/** Shape returned by every paginated backend endpoint. */
export interface PagedResponse<T> {
  items: T[];
  page: number;   // 1-indexed current page
  limit: number;  // page size
  total: number;  // total matching records
}

/** Derive total page count from a paged response. */
export function calcTotalPages(r: Pick<PagedResponse<unknown>, "total" | "limit">): number {
  return r.limit > 0 ? Math.ceil(r.total / r.limit) : 0;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path?: string;
}
