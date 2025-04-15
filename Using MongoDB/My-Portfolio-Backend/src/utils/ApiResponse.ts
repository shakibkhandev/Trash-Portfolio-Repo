interface PaginationLinks {
  self: string;
  first: string;
  prev: string | null;
  next: string | null;
  last: string | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  links?: PaginationLinks;
}

class ApiResponse<T> {
  readonly statusCode: number;
  readonly data: T | null;
  readonly message: string;
  readonly success: boolean;
  readonly pagination?: Pagination;

  constructor(
    statusCode: number,
    data: T | null,
    message = "Success",
    pagination?: Pagination
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.pagination = pagination;
  }

  static success<T>(data: T, pagination?: Pagination): ApiResponse<T> {
    return new ApiResponse(200, data, "Success", pagination);
  }

  static error(message: string, statusCode = 500): ApiResponse<null> {
    return new ApiResponse(statusCode, null, message);
  }
}

export { ApiResponse, Pagination, PaginationLinks };
